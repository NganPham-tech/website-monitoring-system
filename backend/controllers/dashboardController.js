const dashboardService = require('../services/dashboardService');

/**
 * Controller to handle Dashboard quick metrics
 */
const getMetrics = async (req, res) => {
  try {
    const userId = req.user.id;
    const metrics = await dashboardService.getMetrics(userId);

    res.status(200).json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Error in getMetrics controller:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 * Controller to handle Chart Data
 */
const getChartData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { range } = req.query; // expected '24h', '7d', '30d', '90d'

    const chartData = await dashboardService.getChartData(userId, range || '24h');

    res.status(200).json({
      success: true,
      data: chartData
    });
  } catch (error) {
    console.error('Error in getChartData controller:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 * Controller to handle Recent Monitors
 */
const getRecentMonitors = async (req, res) => {
  try {
    const userId = req.user.id;

    const recentMonitors = await dashboardService.getRecentMonitors(userId);

    res.status(200).json({
      success: true,
      data: recentMonitors
    });
  } catch (error) {
    console.error('Error in getRecentMonitors controller:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

module.exports = {
  getMetrics,
  getChartData,
  getRecentMonitors
};
