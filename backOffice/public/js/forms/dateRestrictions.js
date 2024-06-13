// Função para configurar a data máxima no input de data de nascimento
document.addEventListener('DOMContentLoaded', (event) => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dateOfBirthday').setAttribute('max', today);
});