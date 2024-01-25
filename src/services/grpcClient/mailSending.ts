import * as grpc from '@grpc/grpc-js';
import { EmailService } from './notifHelpers';  // Adjust the import based on your generated file

const EMAIL_SERVICE_ADDRESS = 'localhost:50051'; // Replace with your gRPC server address

const client = EmailService(
    EMAIL_SERVICE_ADDRESS,
    grpc.credentials.createInsecure() // Use createSsl() for secure connection
);

interface EmailDetails {
    email: string;
    name: string;
    token: string;
}

function sendVerificationEmail(details: EmailDetails) {
    return new Promise((resolve, reject) => {
        const request = new VerificationRequest();
        request.setEmail(details.email);
        request.setName(details.name);
        request.setToken(details.token);

        client.sendVerificationEmail(request, (error, response) => {
            if (error) {
                reject(error);
            } else {
                resolve(response.getStatus());
            }
        });
    });
}

// Usage
sendVerificationEmail({ email: 'example@example.com', name: 'John Doe', token: '123456' })
    .then(status => console.log('Email sent status:', status))
    .catch(error => console.error('Failed to send email:', error));
