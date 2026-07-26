package com.skillmatch.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardDTO {

    private UserDTO user;
    private List<MatchDTO> suggestedMatches;
    private List<SessionDTO> upcomingSessions;
    private List<SessionDTO> completedSessions;
    private long totalMatches;
    private long totalSessions;
}
