package org.akashihi.mdg.api.v1.dto;

public record Problem(String title, Integer status, String instance, String code, String detail) { }
