package com.munchmate.server;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
class ConnectionController {

    @GetMapping("/check-connection")
    public String check() {
        System.out.println("!!! קיבלתי בקשה מהלקוח עכשיו !!!");
        return "החיבור הצליח! השרת והלקוח מדברים.";
    }
}