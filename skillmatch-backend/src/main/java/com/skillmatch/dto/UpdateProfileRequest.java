package com.skillmatch.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {

    @Size(max = 100, message = "Name must be under 100 characters")
    private String name;

    @Size(max = 500, message = "Bio must be under 500 characters")
    private String bio;

    @Size(max = 200, message = "College must be under 200 characters")
    private String college;

    @Size(max = 200, message = "Availability must be under 200 characters")
    private String availability;
}
