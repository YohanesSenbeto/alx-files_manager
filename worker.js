import Queue from 'bull/lib/queue';
import dbClient from './utils/db';

const mailer = require('./utils/mailer.js');

const userQueue = new Queue('email sending');

userQueue.process(async (job, done) => {
  const userId = job.data.userId || null;

  if (!userId) {
    throw new Error('Missing userId');
  }

  const user = await dbClient.usersCollection().findOne({ _id: userId });

  if (!user) {
    throw new Error('User not found');
  }

  console.log(`Welcome ${user.email}!`);

  try {
    const mailSubject = 'Welcome to ALX-Files_Manager by YohanesSenbeto';
    const mailContent = `
      <div>
        <h3>Hello ${user.name},</h3>
        Welcome to <a href="https://github.com/YohanesSenbeto/alx-files_manager">ALX-Files_Manager</a>,
        a simple file management API built with Node.js by YohanesSenbeto.
        We hope it meets your needs.
      </div>
    `;

    // Assuming Mailer.sendMail function sends the email
    Mailer.sendMail(
      Mailer.buildMessage(user.email, mailSubject, mailContent),
    );

    done();
  } catch (err) {
    done(err);
  }
});
