package com.rohit.jobtracker.auth;

import com.rohit.jobtracker.user.User;

public record RotatedRefreshToken(User user, String rawToken) {
}
