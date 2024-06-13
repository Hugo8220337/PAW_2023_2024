const crypto = require("crypto"); // Adicione esta linha para importar o módulo crypto
const fs = require("fs");
const emailUtil = require('../utils/mail');

var coupon = require("../models/coupon");
var user = require("../models/user");
var store = require("../models/store");

// todas as funções em baixo vão ser métdodos do objeto couponController
const couponController = {};

couponController.generate = async (req, res) => {
    const { userId, storeId, pointsGiven } = req.body;

    // pointsGiven vou receber do componente 
    // Um copão custa sempre 100 pontos  equivale 5% não pode ter mais do que 30% de desconto 

    try {

        // Verificar se o usuário existe
        const userExists = await user.findById(userId);
        if (!userExists) {
            return res.status(404).send("User not found.");
        }

        // Verificar se a loja existe
        const storeExists = await store.findById(storeId);
        if (!storeExists) {
            return res.status(404).send("Store not found.");
        }

        // Gerar código único para o cupom usando crypto
        const code = crypto.randomBytes(20).toString('hex');
        const discount = Math.min(5 + Math.floor(pointsGiven / 100), 30); // Máximo de 30% de desconto

         // Calcular o desconto
         const discountPointsUsed = (discount / 5) * 100; // Calcula quantos pontos foram gastos para obter esse desconto

        // Criar novo documento de cupom
        const newCoupon = await coupon.create({
            code,
            userId,
            storeId,
            discount,
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dias a partir da data atual
        });

        // Mandar email com o link com o token
        const to = userExists.email; // Suponha que o e-mail do usuário está disponível em user.email
        const subject = "Cupão ";
        const html = `<p>Você recebeu este e-mail porque redimeu um copão com `+ newCoupon.discount +`% na loja `+ storeExists.name + `.</p></br>` +
            `<p>Tem prazo de 30 dias desde da data atual:</p></br><br>` +
            `<p>O cupão é:  <b>`+ newCoupon.code +`</b> .</p><br>`;

        await sendMail(to, subject, html); // Envie o e-mail

        // Subtrair os pontos utilizados do usuário
        userExists.points = userExists.points - discountPointsUsed;
        await userExists.save();


        res.status(201).send(newCoupon);
        //res.status(200).send({ message: "Token enviado por e-mail" });

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error: " + error.message);
    }
};

async function sendMail(to, subject, html) {
    return emailUtil.sendMail(to, subject, html); // Chama a função sendMail do seu utilitário de e-mail
}

module.exports = couponController;