import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Addhab = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("global");
  return (
    <div>
      <button onClick={() => i18n.changeLanguage("es")}>ES</button>
      <button onClick={() => i18n.changeLanguage("en")}>EN</button>
      <br />
      <input type="text" placeholder={t("btn3.btn3")} />
      <button>{t("btn1.btn1")}</button>
      <button onClick={() => navigate("/Adjuntararmario")}>
        {t("btn2.btn2")}
      </button>
      <button onClick={() => navigate("/adjuntar")}>{t("btn4.btn4")}</button>
    </div>
  );
};

export default Addhab;
