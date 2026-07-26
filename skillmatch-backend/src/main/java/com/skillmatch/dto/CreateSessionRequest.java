package com.skillmatch.dto;

import com.skillmatch.enums.SessionMode;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateSessionRequest {

    @NotNull(message = "Match ID is required")
    private Long matchId;

    @NotNull(message = "Scheduled date is required")
    private LocalDate scheduledDate;

    @NotNull(message = "Scheduled time is required")
    private LocalTime scheduledTime;

    @NotNull(message = "Session mode is required")
    private SessionMode mode;

    @Size(max = 500)
    private String meetingLink;

    @Size(max = 300)
    private String location;
}
