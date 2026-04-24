export declare namespace LFAI {
  
        type ChatRequestDto =
          {
              /** The user message to send to ARIA-7 AI assistant */
                'message': string;
              /** Custom AI agent name from user settings (default: ARIA-7) */
                'agentName'?: string;
              /** AI personality style to use for the response */
                'agentPersonality'?: "friendly" | "professional" | "motivational" | "strict";
          }
        
  
        type getHistoryParams =
          {
              /** Number of messages to retrieve (default: 50) */
                'limit'?: number;
          }
        
  
        type getTimelineParams =
          {
              /** Number of entries to retrieve (default: 50) */
                'limit'?: number;
              /** ISO timestamp for cursor-based pagination */
                'before'?: string;
          }
        
  
        type ReportActivityDto =
          {
              /** Type of activity event being reported */
                'eventType': string;
              /** Additional data associated with the activity event */
                'data'?: Record<string, any>;
          }
        
  
        type SubmitFeedbackDto =
          {
              /** Type of feedback being submitted */
                'eventType': string;
              /** Feedback content and metadata */
                'data': Record<string, any>;
          }
        
  
}
