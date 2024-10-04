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
    setStep(1); // Passo 1: Após confirmar presença, mostrar as opções de bebida
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
        `https://pagode-8a84169bad42.herokuapp.com/invite/${inviteId}/drinks`,
        { rsvp, drink }
      );

      alert("Dados enviados com sucesso!");
      setStep(2); // Passo 2: Após enviar preferências, exibe somente a arte e o título
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
            </div>

            <button onClick={handleSubmit} className="submitButton">
              Enviar preferências
            </button>
          </>
        )}

        {/* Exibir mensagem final após submissão no passo 2 */}
        {step === 2 && <h2>Obrigado! Nos vemos na festa! 🎉</h2>}

        {/* Exibir resposta "não" diretamente no passo 1 */}
        {step === 1 && rsvp === "não" && (
          <div className="response">
            <h3>Os de verdade, eu sei quem são...😪</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default BirthdayInvitation;
