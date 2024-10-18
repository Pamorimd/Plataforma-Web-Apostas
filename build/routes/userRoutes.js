"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
// Rota para retirar fundos de um usuário
router.post('/withdrawFunds', userController_1.withdrawFunds);
exports.default = router;
