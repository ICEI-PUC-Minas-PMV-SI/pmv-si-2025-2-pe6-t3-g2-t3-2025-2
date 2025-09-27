package br.com.g2.medlink.service;

import br.com.g2.medlink.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    public User getCurrentUser(){
        Authentication currentAuth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = null;
        if (currentAuth.isAuthenticated()){
            var userDetails = (UserDetails) currentAuth.getPrincipal();
            currentUser = (User) userDetails;
        }
        return currentUser;
    }
}
