package br.com.g2.medlink.entity.enums;

public enum UserRole {
    ADMIN("admin"),
    MEDICO("medico"),
    PACIENTE("paciente");

    private String role;

    UserRole(String role){
        this.role = role;
    }

    public String getRole(){
        return role;
    }
}
