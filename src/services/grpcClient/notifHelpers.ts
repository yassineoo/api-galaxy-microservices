
import { Observable } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';


export interface SmsService {
    initPhoneNumberVerification(
        data: PhoneNumberRequest,
        metadata?: Metadata,
        ...rest: any[]
    ): Observable<VerificationResponse>;
    verifyPhoneNumber(
        data: PhoneNumberVerificationRequest,
        metadata?: Metadata,
        ...rest: any[]
    ): Observable<VerifyResponse>;
}
export interface PhoneNumberRequest {
    phoneNumber?: string;
}
export interface PhoneNumberVerificationRequest {
    phoneNumber?: string;
    otp?: string;
}
export interface VerificationResponse {
    status?: string;
}
export interface VerifyResponse {
    status?: boolean;
}
export interface EmailService {
    sendResetPasswordEmail(
        data: VerificationRequest,
        metadata?: Metadata,
        ...rest: any[]
    ): Observable<EmailResponse>;
    sendVerificationEmail(
        data: VerificationRequest,
        metadata?: Metadata,
        ...rest: any[]
    ): Observable<EmailResponse>;
}
export interface VerificationRequest {
    email?: string;
    name?: string;
    token?: string;
}
export interface EmailResponse {
    status?: boolean;
}


