package com.skillmatch.dto;

import com.skillmatch.enums.SessionMode;
import com.skillmatch.enums.SessionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SessionDTO {

    private Long id;
    private Long matchId;

    private Long requesterId;
    private String requesterName;
    private Long responderId;
    private String responderName;

    private String requesterSkill;
    private String responderSkill;

    private LocalDate scheduledDate;
    private LocalTime scheduledTime;
    private SessionMode mode;
    private String meetingLink;
    private String location;
    private SessionStatus status;
    private LocalDateTime createdAt;

    private boolean ratedByRequester;
    private boolean ratedByResponder;
}
