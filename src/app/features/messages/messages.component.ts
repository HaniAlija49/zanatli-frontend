import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MessagesService } from '../../core/services/messages.service';
import { Message } from '../../shared/interfaces/message.interface';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  template: `
    <div class="chat-container">
      <div class="chat-header">
        <button class="back-button" (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h2>Messages</h2>
      </div>
      
      <div class="messages-list" #messagesList>
        <div *ngFor="let message of messages" 
             class="message" 
             [ngClass]="{'message-sent': message.sender.id === currentUserId}">
          <div class="message-content">
            <p>{{ message.text }}</p>
            <small>{{ message.createdAt | date:'short' }}</small>
          </div>
        </div>
      </div>

      <div class="error-message" *ngIf="errorMessage">
        {{ errorMessage }}
      </div>

      <div class="message-input-container">
        <form (ngSubmit)="sendMessage()" class="message-form">
          <mat-form-field appearance="outline" class="message-input-field">
            <input matInput
                   [(ngModel)]="newMessage"
                   name="message"
                   placeholder="Type your message..."
                   #messageInput>
          </mat-form-field>
          <button mat-fab color="primary" type="submit" [disabled]="!newMessage.trim()">
            <mat-icon>send</mat-icon>
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .chat-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      max-width: 800px;
      margin: 0 auto;
      background: #f8f9fa;
      position: relative;
    }

    .chat-header {
      display: flex;
      align-items: center;
      padding: 1rem;
      background: #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      position: relative;
      z-index: 2;
      height: 64px;
    }

    .back-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      margin-right: 1rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      color: #1976d2;
      height: 40px;
      width: 40px;
    }

    .back-button:hover {
      background-color: rgba(25, 118, 210, 0.1);
      transform: scale(1.1);
    }

    .chat-header h2 {
      margin: 0;
      font-size: 1.2rem;
      color: #333;
      font-weight: 500;
    }

    .messages-list {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      background: #f8f9fa;
      height: calc(100vh - 140px);
    }

    .message {
      display: flex;
      margin-bottom: 0.5rem;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .message-sent {
      justify-content: flex-end;
    }

    .message-content {
      max-width: 70%;
      padding: 0.8rem 1.2rem;
      border-radius: 1.2rem;
      background: #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      position: relative;
    }

    .message-sent .message-content {
      background: #1976d2;
      color: white;
    }

    .message-content p {
      margin: 0 0 0.3rem 0;
      line-height: 1.5;
      font-size: 0.95rem;
    }

    .message-content small {
      font-size: 0.75em;
      opacity: 0.8;
      display: block;
      text-align: right;
    }

    .error-message {
      color: #dc3545;
      padding: 0.8rem 1rem;
      background: #f8d7da;
      border-radius: 8px;
      margin: 0.5rem 1rem;
      text-align: center;
      font-size: 0.9rem;
    }

    .message-input-container {
      padding: 1rem;
      background: #fff;
      box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
      position: relative;
      width: 100%;
      z-index: 2;
    }

    .message-form {
      display: flex;
      gap: 1rem;
      align-items: center;
      max-width: 800px;
      margin: 0 auto;
    }

    .message-input-field {
      flex: 1;
      margin: 0;
    }

    .message-input-field ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }

    .message-input-field ::ng-deep .mat-mdc-form-field-flex {
      background: #f8f9fa;
      border-radius: 24px;
      padding: 0 1rem;
    }

    button[mat-fab] {
      width: 48px;
      height: 48px;
      transition: transform 0.2s ease;
    }

    button[mat-fab]:not(:disabled):hover {
      transform: scale(1.1);
    }

    button[mat-fab]:disabled {
      background-color: #ccc;
    }

    @media (max-width: 600px) {
      .chat-container {
        height: 100vh;
      }

      .message-content {
        max-width: 85%;
      }

      .messages-list {
        padding: 1rem;
        height: calc(100vh - 140px);
      }
    }
  `]
})
export class MessagesComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesList') private messagesList!: ElementRef;
  @ViewChild('messageInput') private messageInput!: ElementRef;
  
  messages: Message[] = [];
  newMessage: string = '';
  jobId: number;
  currentUserId: string = '';
  errorMessage: string = '';

  constructor(
    private messagesService: MessagesService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.jobId = Number(this.route.snapshot.paramMap.get('jobId'));
    const currentUser = this.authService.getCurrentUser();
    this.currentUserId = currentUser?.id?.toString() || '';
  }

  ngOnInit() {
    this.loadMessages();
    // Set up polling for new messages every 5 seconds
    setInterval(() => this.loadMessages(), 5000);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  loadMessages() {
    this.messagesService.getMessages(this.jobId).subscribe({
      next: (messages) => {
        this.messages = messages;
        this.errorMessage = '';
        this.scrollToBottom();
      },
      error: (error) => {
        this.errorMessage = error.message;
        if (error.message.includes('not authorized')) {
          this.router.navigate(['/']);
        }
      }
    });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const currentUser = this.authService.getCurrentUser();
    const tempMessage: Message = {
      id: Date.now(),
      text: this.newMessage,
      createdAt: new Date().toISOString(),
      sender: {
        id: currentUser?.id?.toString() || '',
        email: currentUser?.email || ''
      }
    };

    // Add message immediately with correct styling
    this.messages.push(tempMessage);
    this.newMessage = '';
    this.errorMessage = '';
    this.scrollToBottom();
    setTimeout(() => this.messageInput.nativeElement.focus(), 0);

    // Send to server
    this.messagesService.sendMessage(this.jobId, { text: tempMessage.text }).subscribe({
      next: (message) => {
        // Replace temp message with server response
        const index = this.messages.findIndex(m => m.id === tempMessage.id);
        if (index !== -1) {
          this.messages[index] = message;
        }
      },
      error: (error) => {
        this.errorMessage = error.message;
        // Remove temp message on error
        this.messages = this.messages.filter(m => m.id !== tempMessage.id);
      }
    });
  }

  goBack() {
    const userType = this.authService.getCurrentUser()?.roles;
    if (userType?.includes('CLIENT')) {
      this.router.navigate(['/client/jobs']);
    } else if (userType?.includes('CONTRACTOR')) {
      this.router.navigate(['/contractor/jobs']);
    } else {
      this.router.navigate(['/']);
    }
  }

  private scrollToBottom() {
    try {
      const element = this.messagesList.nativeElement;
      element.scrollTop = element.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
} 