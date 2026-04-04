const Incident = require('../models/Incident');
const User = require('../models/User'); // Replace with actual path if different

class IncidentService {
  async getIncidentDetails(incidentId, userId) {
    // Basic verification to retrieve incident with relations
    const incident = await Incident.findById(incidentId)
      .populate('assignee', 'name avatar') // Get ID, Tên, Avatar cho assignee
      .populate('timeline.userId', 'name avatar'); // Populate người thực hiện action

    if (!incident) {
      return null;
    }

    // In a real SaaS, we would check if this project belongs to the user or team here
    // e.g. verify if user has access to incident.projectId
    // Since Project model is generic, we skip complex RBAC in this example, assuming auth passes.

    return incident;
  }

  async resolveIncident(incidentId, userId) {
    const incident = await Incident.findById(incidentId);
    if (!incident) throw new Error('Incident_Not_Found');
    if (incident.status === 'resolved') throw new Error('Incident_Already_Resolved');

    incident.status = 'resolved';
    incident.resolvedAt = new Date();

    // Thêm hệ thống log vào timeline
    incident.timeline.push({
      userId,
      title: 'Sự cố đã được giải quyết',
      description: 'Đánh dấu hoàn thành qua hệ thống',
      type: 'resolved',
    });

    await incident.save();
    return await incident.populate('assignee', 'name avatar');
  }

  async addTimelineNote(incidentId, userId, payload) {
    const { message, statusUpdate } = payload;

    const incident = await Incident.findById(incidentId);
    if (!incident) throw new Error('Incident_Not_Found');

    // Thêm bản ghi mới
    incident.timeline.push({
      userId,
      title: statusUpdate ? `Trạng thái: ${statusUpdate}` : 'Ghi chú cập nhật',
      description: message,
      type: 'note',
    });

    // Nếu statusUpdate là "Đã giải quyết" ("resolved") qua endpoint khác. 
    // Chỗ này chỉ cập nhật title, bạn có thể build thêm logic mapping status tại đây.

    await incident.save();
    return incident;
  }

  async assignIncident(incidentId, userId, assigneeId) {
    const incident = await Incident.findById(incidentId);
    if (!incident) throw new Error('Incident_Not_Found');

    // Validate assigneeId (Kiểm tra xem User đó có tồn tại hay không)
    const assigneeUser = await User.findById(assigneeId);
    if (!assigneeUser) throw new Error('Assignee_Not_Found');

    incident.assignee = assigneeId;

    incident.timeline.push({
      userId,
      title: `Gán người xử lý`,
      description: `Sự cố được gán cho [${assigneeUser.name || 'Thành viên mới'}]`,
      type: 'note',
    });

    await incident.save();
    return await incident.populate('assignee', 'name avatar');
  }
}

module.exports = new IncidentService();
