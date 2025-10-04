# 🎨 Paleta Cam

> Um Progressive Web App (PWA) que extrai paletas de cores do mundo real usando a câmera do seu dispositivo.

Este projeto foi desenvolvido para demonstrar o uso de APIs de hardware do navegador (Câmera), processamento de imagem no lado do cliente com a API do Canvas e o consumo de uma API externa (The Color API) para enriquecer os dados.

---

## 🚀 Demo

Você pode testar a aplicação acessando o link abaixo:

**[Acesse a demonstração ao vivo aqui!](https://seu-link-para-o-github-pages-ou-outro-host.com)**

---

## ✨ Funcionalidades

* **Acesso direto à câmera:** Utiliza a câmera traseira do dispositivo para visualização em tempo real.
* **Captura de imagem:** Tira uma "foto" do frame atual do vídeo para análise.
* **Extração de Cores:** Identifica as 5 cores predominantes na imagem capturada.
* **Nomes de Cores:** Busca o nome de cada cor via API externa (The Color API).
* **Interface Responsiva:** O layout se adapta a diferentes tamanhos de tela, de telemóveis a desktops.
* **Funcionalidade PWA:**
    * Pode ser "instalado" na tela inicial do seu dispositivo.
    * Funciona offline graças ao Service Worker, que armazena os arquivos essenciais em cache.

---

## 🛠️ Tecnologias Utilizadas

* **HTML5:** Estrutura semântica da aplicação.
* **CSS3:** Estilização personalizada e responsividade.
* **Tailwind CSS:** Framework CSS "utility-first" para agilizar a estilização.
* **JavaScript (Vanilla JS):** Lógica principal da aplicação, sem frameworks.
* **APIs do Navegador:**
    * `navigator.mediaDevices.getUserMedia`: Para acesso à câmera.
    * `Canvas API`: Para processamento de imagem e extração de píxeis.
    * `Service Worker`: Para a funcionalidade offline.
* **The Color API:** API externa para obter informações sobre as cores.

---
