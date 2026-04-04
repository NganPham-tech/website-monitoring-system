const { z } = require('zod');
const incidentService = require('../services/incidentService');

// Validations
const timelineSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  statusUpdate: z.string().optional(),
});

const assignSchema = z.object({
  assigneeId: z.string().min(1, 'Assignee ID is required'),
});

class IncidentController {
  // GET /api/incidents/:id
  async getIncident(req, res) {
    const { id } = req.params;
    const userId = req.user.id; // From authMiddleware

    const incident = await incidentService.getIncidentDetails(id, userId);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found',
      });
    }

    res.status(200).json({
      success: true,
      data: incident,
    });
  }

  // PUT /api/incidents/:id/resolve
  async resolveIncident(req, res) {
    const { id } = req.params;
    const userId = req.user.id;

    try {
      const incident = await incidentService.resolveIncident(id, userId);
      res.status(200).json({
        success: true,
        data: incident,
      });
    } catch (error) {
      if (error.message === 'Incident_Not_Found') {
        return res.status(404).json({ success: false, message: 'Incident not found' });
      }
      if (error.message === 'Incident_Already_Resolved') {
        return res.status(400).json({ success: false, message: 'Incident is already resolved' });
      }
      throw error; // Let the global error handler catch it
    }
  }

  // POST /api/incidents/:id/timeline
  async addTimeline(req, res) {
    const { id } = req.params;
    const userId = req.user.id;

    const parseResult = timelineSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parseResult.error.errors,
      });
    }

    try {
      const incident = await incidentService.addTimelineNote(id, userId, parseResult.data);
      res.status(201).json({
        success: true,
        data: incident,
      });
    } catch (error) {
      if (error.message === 'Incident_Not_Found') {
        return res.status(404).json({ success: false, message: 'Incident not found' });
      }
      throw error;
    }
  }

  // PUT /api/incidents/:id/assign
  async assignIncident(req, res) {
    const { id } = req.params;
    const userId = req.user.id;

    const parseResult = assignSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parseResult.error.errors,
      });
    }

    try {
      const incident = await incidentService.assignIncident(id, userId, parseResult.data.assigneeId);
      res.status(200).json({
        success: true,
        data: incident,
      });
    } catch (error) {
      if (error.message === 'Incident_Not_Found') {
        return res.status(404).json({ success: false, message: 'Incident not found' });
      }
      if (error.message === 'Assignee_Not_Found') {
        return res.status(400).json({ success: false, message: 'Assignee does not exist in your team' });
      }
      throw error;
    }
  }
}

module.exports = new IncidentController();
