// Referral service for mobile app
import { apiClient } from './apiClient';
import { Assignment, ReferralResponse } from '../types';

export class ReferralService {
  /**
   * Get pending assignments for an investigator (T5/R5)
   */
  async getInvestigatorAssignments(investigatorId: number): Promise<ReferralResponse> {
    try {
      const response = await apiClient.get<ReferralResponse>(
        `/referrals/investigator/${investigatorId}/pending`
      );
      return response;
    } catch (error) {
      console.error('Error fetching investigator assignments:', error);
      throw error;
    }
  }

  /**
   * Accept a referral assignment
   */
  async acceptReferral(referralId: number, userId: number, userTier: string): Promise<any> {
    try {
      const response = await apiClient.put<any>(`/referrals/${referralId}/accept`, {
        userId,
        userTier
      });
      return response;
    } catch (error) {
      console.error('Error accepting referral:', error);
      throw error;
    }
  }

  /**
   * Reject a referral assignment
   */
  async rejectReferral(
    referralId: number,
    userId: number,
    userTier: string,
    reason: string
  ): Promise<any> {
    try {
      const response = await apiClient.put<any>(`/referrals/${referralId}/reject`, {
        userId,
        userTier,
        reason
      });
      return response;
    } catch (error) {
      console.error('Error rejecting referral:', error);
      throw error;
    }
  }

  /**
   * Start investigation (mark as in progress)
   */
  async startInvestigation(referralId: number): Promise<any> {
    try {
      const response = await apiClient.put<any>(`/referrals/${referralId}/start-investigation`, {});
      return response;
    } catch (error) {
      console.error('Error starting investigation:', error);
      throw error;
    }
  }

  /**
   * Get referral details by ID
   */
  async getReferralDetails(referralId: number): Promise<Assignment> {
    try {
      const response = await apiClient.get<Assignment>(`/referrals/${referralId}`);
      return response;
    } catch (error) {
      console.error('Error fetching referral details:', error);
      throw error;
    }
  }

  /**
   * Complete a referral (when investigation case is created)
   */
  async completeReferral(
    referralId: number,
    epiCaseId: number,
    epiTableName: string
  ): Promise<any> {
    try {
      const response = await apiClient.put<any>(`/referrals/${referralId}/complete`, {
        epiCaseId,
        epiTableName
      });
      return response;
    } catch (error) {
      console.error('Error completing referral:', error);
      throw error;
    }
  }
}

export const referralService = new ReferralService();
