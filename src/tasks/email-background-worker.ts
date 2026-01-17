import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailService } from 'src/modules/mail/mail.service';

@Processor('email-verification', { limiter: { duration: 10000, max: 20 } })
export class EmailSentWorker extends WorkerHost {
  constructor(private readonly mailService: MailService) {
    super();
  }

  async process(job: Job, token?: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.mailService.sendEmail(job.data.email, job.data.username, otp);
  }

  // log the status of job by using this decorators
  @OnWorkerEvent('active')
  onJobAdded(job: Job) {
    console.log(`Got a new job and id = ${job.id}`);
  }

  @OnWorkerEvent('completed')
  onJobCompleted(job: Job) {
    console.log(`Job with this id = ${job.id} is Completed`);
  }

  @OnWorkerEvent('failed')
  onJobFailed(job: Job) {
    console.log(`Job with this id = ${job.id} failed`);
    console.log(`Attempts = ${job.attemptsMade}`);
  }
}
