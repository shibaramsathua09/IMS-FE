import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { NotificationResponseDto } from '../../auth/dtos/notificationResponseDto.dto';

import { ApiResponse } from '../../../shared/api-response.interface';
import { AgentService } from '../agent.service';

@Component({
  selector: 'app-agent-notifications',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
    MatToolbarModule,
    MatTooltipModule,
    MatBadgeModule
  ],
  templateUrl: './agent-notifications.component.html',
  styleUrl: './agent-notifications.component.css'
})
export class AgentNotificationsComponent implements OnInit {
  totalNotifications: number = 0; // Total number of notifications for display
  notifications: NotificationResponseDto[] = [];

  constructor(private agentService: AgentService) {}

  ngOnInit(): void {
    this.getNotifications();
  }

  getNotifications(): void {
    this.agentService.getNotifications().subscribe({
      next: (response: ApiResponse<NotificationResponseDto[]>) => {
        if (response.isSuccess) {
          this.notifications = response.data.map(notification => {
            // Convert UTC time to IST
            const utcDate = new Date(notification.createdAt);
            notification.createdAt = this.convertUtcToIst(utcDate);
            return notification;
          });

          // Sort notifications by IST time
          this.notifications.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA; // Sort in descending order (latest first)
          });

          this.totalNotifications = this.notifications.length;
          console.log(`Total notifications fetched: ${this.totalNotifications}`);
        } else {
          console.error('Failed to fetch notifications:', response.message);
        }
      },
      error: (error: any) => {
        console.error('Error fetching notifications:', error);
      }
    });
  }

  convertUtcToIst(utcDate: Date): string {
    // Convert UTC date to IST (Indian Standard Time)
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istDate = new Date(utcDate.getTime() + istOffset);
    return istDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  }

  get hasUnreadNotifications(): boolean {
    return this.notifications.some(n => !n.read);
  }

  get unreadNotificationCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  toggleReadStatus(notification: NotificationResponseDto): void {
    notification.read = !notification.read;
    console.log(`Notification ${notification.notificationId} marked as ${notification.read ? 'read' : 'unread'}.`);
  }

  dismissNotification(notificationId: string): void {
    if (!notificationId) {
      console.warn("Dismiss called with undefined ID — aborting.");
      return;
    }

    this.notifications = [...this.notifications.filter(n => n.notificationId !== notificationId)];
    console.log(`Notification ${notificationId} dismissed (deleted).`);
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    console.log('All notifications marked as read.');
  }
}
