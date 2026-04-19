import type {
  ConversationEntry,
  FeedbackRequestEntry,
  SystemEventEntry,
  TimelineEntry,
  UserActivityEntry,
} from './types';

export const createMockTimeline = (): TimelineEntry[] => {
  const today = (hour: number, minute: number) => {
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    return date;
  };

  return [
    {
      id: '1',
      type: 'system_event',
      eventType: 'morning_briefing',
      timestamp: today(9, 0),
      severity: 'info',
      content:
        "🌅 **Good morning, Captain!** Based on your productivity DNA, you're entering your **peak performance window**.\n\n**Today's Intelligence Brief:**\n- 🎯 **5 missions** in Ring 1 (2 critical, 3 high priority)\n- ⚡ Your energy pattern suggests **optimal focus** until 12:00\n- 🔥 Current momentum score: **82/100** (+12% from yesterday)\n- 📈 You're on a **7-day completion streak** — let's make it 8!\n\n**Recommended Mission:** Tackle `API Integration` (complexity 4) during this peak window. You typically complete complex tasks 47% faster before noon.",
    } as SystemEventEntry,

    {
      id: '2',
      type: 'user_activity',
      action: 'task_created',
      timestamp: today(9, 5),
      taskTitle: 'Fix critical login bug',
      taskId: 'task_123',
      details: { priority: 'critical', complexity: 3, dueDate: 'Today 17:00' },
    } as UserActivityEntry,

    {
      id: '3',
      type: 'conversation',
      role: 'agent',
      timestamp: today(9, 6),
      content:
        "🔍 I see a new **critical priority** task just appeared on sensors. The complexity rating (3/5) suggests this could take 2-3 hours.\n\nWant me to:\n- Break it down into subtasks?\n- Estimate time based on your historical velocity?\n- Check if it conflicts with your existing schedule?",
      toolCalls: [
        { name: 'getTask', status: 'done' },
        { name: 'analyzeComplexity', status: 'done' },
      ],
    } as ConversationEntry,

    {
      id: '4',
      type: 'conversation',
      role: 'captain',
      timestamp: today(9, 7),
      content: 'Yes, break it down and check my schedule',
    } as ConversationEntry,

    {
      id: '5',
      type: 'conversation',
      role: 'agent',
      timestamp: today(9, 7),
      content:
        "**Mission Analysis: Fix critical login bug**\n\n### Subtask Breakdown\n1. ✅ Reproduce bug in dev environment (25 min)\n2. ⏳ Isolate root cause with debugger (35 min)\n3. ⏳ Implement fix + unit test (55 min)\n4. ⏳ Test in staging environment (20 min)\n\n**Total estimated time:** ~2h 15min\n\n### Schedule Conflict Detected ⚠️\nYou have `API Integration` scheduled 10:00-12:00. Both tasks are critical.\n\n**Recommendation:** Start login bug fix **now** (high urgency), defer API Integration to afternoon slot when you still have good energy (historically 70% peak performance 14:00-16:00).",
      toolCalls: [
        { name: 'createSubtasks', status: 'done' },
        { name: 'estimateTime', status: 'done' },
        { name: 'checkSchedule', status: 'done' },
      ],
    } as ConversationEntry,

    {
      id: '6',
      type: 'user_activity',
      action: 'subtask_completed',
      timestamp: today(9, 30),
      taskTitle: 'Fix critical login bug',
      taskId: 'task_123',
      details: {
        subtask: 'Reproduce bug in dev environment',
        estimatedTime: '25 min',
        actualTime: '18 min',
      },
    } as UserActivityEntry,

    {
      id: '7',
      type: 'system_event',
      eventType: 'celebration',
      timestamp: today(9, 31),
      severity: 'success',
      content:
        "🎯 **Excellent work, Captain!** Subtask completed **7 minutes faster** than estimated.\n\nI'm learning: You tend to reproduce bugs 28% faster than average developers. Updating your productivity DNA with this pattern.",
    } as SystemEventEntry,

    {
      id: '7b',
      type: 'conversation',
      role: 'captain',
      timestamp: today(9, 32),
      content:
        "Thanks! I've seen this type of bug before. The root cause is usually in the auth middleware.",
    } as ConversationEntry,

    {
      id: '7c',
      type: 'conversation',
      role: 'agent',
      timestamp: today(9, 33),
      content:
        "Excellent insight! I'm capturing this in your knowledge base: **Bug Pattern → Auth Middleware**.\n\nI'll reference this the next time you encounter authentication issues. Your past experience is valuable intelligence! 🧠",
      toolCalls: [{ name: 'updateUserKnowledge', status: 'done' }],
    } as ConversationEntry,

    {
      id: '8',
      type: 'user_activity',
      action: 'task_created',
      timestamp: today(10, 15),
      taskTitle: 'Update documentation',
      taskId: 'task_124',
    } as UserActivityEntry,

    {
      id: '9',
      type: 'user_activity',
      action: 'subtask_completed',
      timestamp: today(10, 16),
      taskTitle: 'Fix critical login bug',
      taskId: 'task_123',
      details: { subtask: 'Isolate root cause with debugger' },
    } as UserActivityEntry,

    {
      id: '10',
      type: 'system_event',
      eventType: 'context_switch_alert',
      timestamp: today(10, 17),
      severity: 'warning',
      content:
        '⚠️ **Context Switching Detected**\n\nI notice you\'ve switched between tasks **3 times** in the last 12 minutes. Based on complexity delta analysis, this is costing you approximately **~15 minutes** of cognitive reload time.\n\n**Pattern:** This is unusual for you. Your typical deep work sessions last 45-90 minutes uninterrupted.\n\nEverything okay? Consider:\n- 🎧 Enabling "Deep Focus" mode (blocks notifications)\n- ⏰ Setting a 30-min timer for single-task focus\n- 🧘 Taking a 5-min reset break',
      actions: [
        { label: 'Enable Focus Mode', emoji: '🎯' },
        { label: "I'm Fine", emoji: '👍' },
      ],
    } as SystemEventEntry,

    {
      id: '10b',
      type: 'conversation',
      role: 'captain',
      timestamp: today(10, 18),
      content:
        "You're right, I got distracted by a Slack message. Let me finish the login bug first.",
    } as ConversationEntry,

    {
      id: '10c',
      type: 'conversation',
      role: 'agent',
      timestamp: today(10, 19),
      content:
        "Good call, Captain! I'll mute non-critical notifications for the next 30 minutes. Protecting your focus window. 🛡️",
      toolCalls: [{ name: 'enableFocusMode', status: 'done' }],
    } as ConversationEntry,

    {
      id: '11',
      type: 'user_activity',
      action: 'task_completed',
      timestamp: today(11, 0),
      taskTitle: 'Fix critical login bug',
      taskId: 'task_123',
    } as UserActivityEntry,

    {
      id: '12',
      type: 'system_event',
      eventType: 'momentum_update',
      timestamp: today(11, 1),
      severity: 'success',
      content:
        "🚀 **Mission Accomplished!**\n\n**Momentum Analysis:**\n- ✅ Completed in **1h 56min** (19min under estimate)\n- 🔥 Momentum score increased: **82 → 89** (+7 points)\n- 📊 Current streak: **8 days** (new personal record!)\n- 🏆 You've completed **3 critical tasks** before noon this week\n\n**Velocity Insight:** You're operating at **134% of your 30-day average**. Outstanding performance, Captain!",
    } as SystemEventEntry,

    {
      id: '13',
      type: 'feedback_request',
      questionType: 'energy_level',
      timestamp: today(11, 2),
      question: 'Quick energy check — how are you feeling right now?',
      options: [
        { label: 'Energized', emoji: '⚡', value: 'high' },
        { label: 'Steady', emoji: '🔋', value: 'medium' },
        { label: 'Draining', emoji: '🪫', value: 'low' },
      ],
      responded: { value: 'high', respondedAt: today(11, 3) },
    } as FeedbackRequestEntry,

    {
      id: '13b',
      type: 'conversation',
      role: 'captain',
      timestamp: today(11, 30),
      content: "What's my productivity score compared to last week?",
    } as ConversationEntry,

    {
      id: '13c',
      type: 'conversation',
      role: 'agent',
      timestamp: today(11, 31),
      content:
        "**Productivity Analysis: Week-over-Week**\n\n📊 **Current Week (Mon-Today):**\n- Tasks completed: **24** (+4 vs last week)\n- Focus time: **18.5 hours** (+3.2 hours)\n- Momentum score: **89** (+11 points)\n- Completion rate: **96%** (+8%)\n\n🚀 **Standout Metrics:**\n- **Morning velocity:** 142% of baseline (exceptional!)\n- **Deep work sessions:** 8 sessions over 60min (up from 5)\n- **Context switches:** Down 34% (much better focus)\n\n**Trend:** You're having your best week in 2 months! The key factors:\n1. Consistent 9am start times\n2. Fewer meetings (down from 12 to 7)\n3. Better task prioritization\n\nKeep this momentum going, Captain! 🔥",
      toolCalls: [
        { name: 'getProductivityMetrics', status: 'done' },
        { name: 'compareWeeklyTrends', status: 'done' },
      ],
    } as ConversationEntry,

    {
      id: '13d',
      type: 'conversation',
      role: 'captain',
      timestamp: today(12, 15),
      content:
        "Nice! I've been following the deep work principles from Cal Newport's book.",
    } as ConversationEntry,

    {
      id: '13e',
      type: 'conversation',
      role: 'agent',
      timestamp: today(12, 16),
      content:
        "Ah, **Deep Work** principles! That explains the improvement. I can see how you're implementing:\n\n✅ **Rule #1:** Work deeply (your 60+ min sessions)\n✅ **Rule #2:** Embrace boredom (fewer context switches)\n✅ **Rule #3:** Quit social media (I notice no Twitter checks during work hours)\n\nThis is gold, Captain. I'm updating your profile to align my recommendations with deep work methodology. Would you like me to suggest 'deep work' time blocks in your schedule?",
      toolCalls: [{ name: 'updateUserProfile', status: 'done' }],
    } as ConversationEntry,

    {
      id: '13f',
      type: 'conversation',
      role: 'captain',
      timestamp: today(12, 17),
      content: 'Yes, please! Block 9-12 daily for deep work.',
    } as ConversationEntry,

    {
      id: '13g',
      type: 'conversation',
      role: 'agent',
      timestamp: today(12, 18),
      content:
        "**Deep Work Block Activated** 🎯\n\n⏰ **Daily Schedule:** 09:00-12:00\n🔇 **Auto-actions during this block:**\n- Mute all notifications\n- Decline non-critical meetings\n- Set Slack to DND mode\n- Surface only critical/high priority tasks\n\nYour productivity sanctuary is now protected. I'll guard it fiercely! 🛡️",
      toolCalls: [
        { name: 'createRecurringBlock', status: 'done' },
        { name: 'updateNotificationRules', status: 'done' },
      ],
    } as ConversationEntry,

    {
      id: '14',
      type: 'system_event',
      eventType: 'deadline_reminder',
      timestamp: today(13, 0),
      severity: 'warning',
      content:
        "⏰ **Deadline Alert: Database Migration**\n\n**Status:** Not started\n**Due:** In **6 hours** (19:00 today)\n**Estimated effort:** 4-5 hours (complexity 4/5)\n\n**Risk Assessment:** 🔴 **HIGH**\n\nBased on your energy patterns, you have approximately 4.5 hours of productive time remaining today. This deadline is tight.\n\n**Options:**\n- 🚀 Start immediately (recommended)\n- 📅 Request deadline extension\n- 🤝 Delegate to teammate",
      actions: [
        { label: 'Start Now', emoji: '🚀' },
        { label: 'Reschedule', emoji: '📅' },
      ],
    } as SystemEventEntry,

    {
      id: '14b',
      type: 'conversation',
      role: 'captain',
      timestamp: today(13, 45),
      content:
        "I can finish the migration, but I'll need to skip the afternoon meeting.",
    } as ConversationEntry,

    {
      id: '14c',
      type: 'conversation',
      role: 'agent',
      timestamp: today(13, 46),
      content:
        "Smart prioritization! I see you have a 'Team Sync' at 15:00. I'll draft a decline message:\n\n> *Hi team, I need to focus on the critical database migration (deadline 19:00). Can someone share notes after?*\n\nShall I send this?",
      toolCalls: [
        { name: 'checkCalendar', status: 'done' },
        { name: 'draftMessage', status: 'done' },
      ],
    } as ConversationEntry,

    {
      id: '14d',
      type: 'conversation',
      role: 'captain',
      timestamp: today(13, 47),
      content: 'Yes, send it. Thanks!',
    } as ConversationEntry,

    {
      id: '14e',
      type: 'conversation',
      role: 'agent',
      timestamp: today(13, 48),
      content:
        '✅ Message sent to team. Meeting declined. Your calendar is now clear until 19:00.\n\nYou have **5 hours and 12 minutes** of uninterrupted time for the migration. Based on your velocity, you should finish by 18:30 with 30 minutes buffer. 🎯',
      toolCalls: [
        { name: 'sendMessage', status: 'done' },
        { name: 'updateCalendar', status: 'done' },
      ],
    } as ConversationEntry,

    {
      id: '15',
      type: 'user_activity',
      action: 'priority_changed',
      timestamp: today(14, 30),
      taskTitle: 'API Integration',
      taskId: 'task_125',
      details: { from: 'medium', to: 'high' },
    } as UserActivityEntry,

    {
      id: '16',
      type: 'system_event',
      eventType: 'habit_insight',
      timestamp: today(15, 0),
      severity: 'info',
      content:
        '🧠 **Pattern Recognition Alert**\n\nI\'ve detected a recurring behavior pattern:\n\n> **"You always conduct code reviews at 14:00-15:00"**\n> *Confidence: 87% (observed 13 out of 15 working days)*\n\nThis is your **Code Review Power Hour**. During this window, you:\n- Review code 2.3x faster than other times\n- Catch 41% more bugs\n- Leave more detailed feedback\n\n💡 **Suggestion:** Want me to automatically schedule code review tasks for this time slot?',
    } as SystemEventEntry,

    {
      id: '16b',
      type: 'conversation',
      role: 'captain',
      timestamp: today(15, 30),
      content: 'Should I really schedule code reviews at 14:00 every day?',
    } as ConversationEntry,

    {
      id: '16c',
      type: 'conversation',
      role: 'agent',
      timestamp: today(15, 31),
      content:
        "Great question! Here's why 14:00-15:00 is your optimal window:\n\n**Performance Data (last 30 days):**\n- 🕐 **14:00-15:00:** 2.3x faster reviews, 41% more bugs found\n- 🕙 **10:00-11:00:** 1.8x faster, 28% more bugs\n- 🕓 **16:00-17:00:** 1.1x faster, 15% more bugs\n\n**Why it works:**\nAfter lunch, you transition from deep work to analytical tasks naturally. Your brain is still sharp but ready for a different mode. Code review requires critical thinking without needing sustained flow state.\n\n**Recommendation:** Keep the pattern, but make it flexible. If you're in flow on something else, I can suggest rescheduling. Your productivity rhythm > rigid schedule. 🎯",
      toolCalls: [{ name: 'analyzePerformanceByTimeSlot', status: 'done' }],
    } as ConversationEntry,

    {
      id: '17',
      type: 'user_activity',
      action: 'subtask_added',
      timestamp: today(16, 0),
      taskTitle: 'API Integration',
      taskId: 'task_125',
      details: { subtask: 'Write integration tests' },
    } as UserActivityEntry,

    {
      id: '18',
      type: 'system_event',
      eventType: 'burnout_warning',
      timestamp: today(16, 45),
      severity: 'critical',
      content:
        "🚨 **Wellness Alert: Burnout Risk Detected**\n\n**Analysis:**\n- You've been at **142% velocity** for 6 consecutive days\n- Zero breaks taken in the last 4.5 hours\n- Task completion speed declining (down 23% from morning)\n- Current energy level: estimated **LOW** based on completion patterns\n\n**Forecast:** If you continue at this pace, stress level predicted to reach **CRITICAL** by tomorrow afternoon.\n\n**Medical Officer's Recommendation:**\n1. 🛑 Stop work at 18:00 (hard cutoff)\n2. 🚶 Take a 15-minute walk NOW\n3. 🎯 Limit tomorrow to 5 tasks max\n\nYour health is the mission-critical system, Captain.",
      actions: [
        { label: 'Take Break Now', emoji: '🛑' },
        { label: 'Finish This Task First', emoji: '⏱️' },
      ],
    } as SystemEventEntry,

    {
      id: '18b',
      type: 'conversation',
      role: 'captain',
      timestamp: today(16, 50),
      content:
        "You're right. I'll stop at 18:00 and take a walk. I've been pushing too hard.",
    } as ConversationEntry,

    {
      id: '18c',
      type: 'conversation',
      role: 'agent',
      timestamp: today(16, 51),
      content:
        "Thank you for listening, Captain. Your wellbeing is mission-critical. I'll set a hard stop reminder at 17:55.\n\n**Tomorrow's plan:** I'm limiting your schedule to 5 tasks max and building in 3 break blocks. You need recovery time to sustain this excellent performance. 🌱\n\nRemember: Rest is productive. It's how you recharge for the next mission. 💙",
      toolCalls: [
        { name: 'setReminder', status: 'done' },
        { name: 'updateTomorrowSchedule', status: 'done' },
      ],
    } as ConversationEntry,

    {
      id: '19',
      type: 'feedback_request',
      questionType: 'day_rating',
      timestamp: today(17, 0),
      question: 'The day is winding down, Captain. How would you rate today overall?',
      options: [
        { label: 'Excellent', emoji: '🚀', value: 'great' },
        { label: 'Good', emoji: '👍', value: 'ok' },
        { label: 'Challenging', emoji: '😓', value: 'tough' },
      ],
      responded: { value: 'great', respondedAt: today(17, 1) },
    } as FeedbackRequestEntry,

    {
      id: '20',
      type: 'conversation',
      role: 'captain',
      timestamp: today(17, 15),
      content: 'What should I focus on tomorrow?',
    } as ConversationEntry,

    {
      id: '21',
      type: 'conversation',
      role: 'agent',
      timestamp: today(17, 16),
      content:
        "**Tomorrow's Strategic Mission Plan**\n\nBased on your productivity DNA, energy forecast, and current workload:\n\n### Morning Session (09:00-12:00) — Peak Energy ⚡\n- 🎯 `Database Migration` (carry-over, complexity 4) — 3 hours\n- 🎯 `API Integration subtasks` — 1.5 hours\n\n### Afternoon Session (14:00-16:00) — Good Energy 🔋\n- 📋 Code reviews (your power hour 14:00-15:00)\n- 📋 `Documentation updates` — 1 hour\n\n### Not Tomorrow ⏸️\n- Defer all Ring 5+ tasks\n- No new task creation (reduce cognitive load)\n\n**Key Insight:** Tomorrow is Friday. Historically, you complete 31% fewer tasks on Fridays. This plan accounts for that.\n\n**Projected outcome:** 2 major missions completed, stress level reduced to NORMAL range.\n\nRest well tonight, Captain. 🌙",
      toolCalls: [
        { name: 'getRankedTasks', status: 'done' },
        { name: 'getEnergyForecast', status: 'done' },
        { name: 'getUserMemory', status: 'done' },
      ],
    } as ConversationEntry,
  ];
};
