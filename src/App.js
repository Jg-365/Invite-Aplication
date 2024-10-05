import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Importa o CSS

function obterSaudacao() {
  const agora = new Date();
  const horas = agora.getHours();

  if (horas >= 5 && horas < 12) {
    return "Bom dia";
  } else if (horas >= 12 && horas < 18) {
    return "Boa tarde";
  } else {
    return "Boa noite";
  }
}

function BirthdayInvitation() {
  const [rsvp, setRsvp] = useState(null);
  const [drink, setDrink] = useState([]);
  const [guest, setGuest] = useState(null);
  const [saudacao, setSaudacao] = useState("");
  const [step, setStep] = useState(0); // Controla o passo atual da interação

  useEffect(() => {
    const fetchGuestData = async () => {
      try {
        const inviteId = window.location.pathname.split("/").pop();
        const response = await axios.get(
          `https://pagode-8a84169bad42.herokuapp.com/invite/${inviteId}`
        );
        setGuest(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados do convidado:", error);
      }
    };

    fetchGuestData();
    setSaudacao(obterSaudacao());
  }, []);

  const handleRsvp = (response) => {
    setRsvp(response);
    if (response === "sim") {
      setStep(1); // Passo 1: Após confirmar presença, mostrar as opções de bebida
    } else {
      setStep(2); // Passo 2: Exibe a mensagem de despedida
    }
  };

  const handleDrinkChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setDrink((prevDrinks) => [...prevDrinks, value]);
    } else {
      setDrink((prevDrinks) => prevDrinks.filter((drink) => drink !== value));
    }
  };

  const handleSubmit = async () => {
    try {
      const inviteId = window.location.pathname.split("/").pop();
      await axios.post(
        `https://pagode-8a84169bad42.herokuapp.com/invite/${inviteId}/rsvp`,
        { rsvp, drink }
      );
      alert("Dados enviados com sucesso!");
      setStep(3); // Passo 3: Após enviar preferências, exibe somente a arte e o título
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
    }
  };

  return (
    <div className="pageContainer">
      <div className="container">
        <h1>Pagode '03 do João!</h1>
        <div className="artContainer"></div>

        {/* Exibir saudação e nome apenas no passo 0 */}
        {step === 0 && guest && (
          <>
            <h2>
              {saudacao}, {guest.name}!
            </h2>
            <p>
              Que tal uma tardezinha de pagode de mexer com o coração e com o
              fígado? Vem aproveitar o meu aniversário de 21 comigo pô, vai ser
              massa!
            </p>
            <p style={{ fontWeight: "bold" }}>
              Data: 19 de Outubro <br />
              Local: Casa de Eventos ...
            </p>
            <h2>Você vai comparecer?</h2>
            <div>
              <button className="button" onClick={() => handleRsvp("sim")}>
                Sim
              </button>
              <button className="button" onClick={() => handleRsvp("não")}>
                Não
              </button>
            </div>
          </>
        )}

        {/* Exibir opções de bebida no passo 1 */}
        {step === 1 && rsvp === "sim" && (
          <>
            <h2>Escolha suas bebidas favoritas</h2>
            <div
              className="poll"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label>
                <input
                  type="checkbox"
                  value="cachaça"
                  onChange={handleDrinkChange}
                />
                Cachaça
              </label>
              <label>
                <input
                  type="checkbox"
                  value="cerveja"
                  onChange={handleDrinkChange}
                />
                Cerveja
              </label>
              <label>
                <input
                  type="checkbox"
                  value="suco"
                  onChange={handleDrinkChange}
                />
                Suco
              </label>
              <label>
                <input
                  type="checkbox"
                  value="refrigerante"
                  onChange={handleDrinkChange}
                />
                Refrigerante
              </label>
              <label>
                <input
                  type="checkbox"
                  value="vodka"
                  onChange={handleDrinkChange}
                />
                Vodka
              </label>
              <label>
                <input
                  type="checkbox"
                  value="drinks"
                  onChange={handleDrinkChange}
                />
                Drinks
              </label>
            </div>

            <button onClick={handleSubmit} className="submitButton">
              Enviar preferências
            </button>
          </>
        )}

        {/* Exibir mensagem final após submissão no passo 3 */}
        {step === 3 && <h2>Obrigado! Nos vemos na festa! 🎉</h2>}

        {/* Exibir resposta "não" diretamente no passo 2 */}
        {step === 2 && (
          <div className="response">
            <h3>Os de verdade, eu sei quem são...😪</h3>
            <img
              src="data:image/jpeg;base64,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"
              alt="Imagem de despedida"
              style={{ width: "70%", borderRadius: "10px", marginTop: "20px" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default BirthdayInvitation;
