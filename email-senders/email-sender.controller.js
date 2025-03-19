// const { Router } = require('express');
// const { EmailService } = require('./email-sender.service');

// function EmailController() {
//   const router = Router();
//   const emailService = new EmailService(); // Dependency Injection could be handled differently

//   router.post('/send', async (req, res) => {
//     const { to, subject, html } = req.body;

//     try {
//       const result = await emailService.sendEmail(to, subject, html);
//       res.json(result);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });

//   return router;
// }

// module.exports = EmailController;
