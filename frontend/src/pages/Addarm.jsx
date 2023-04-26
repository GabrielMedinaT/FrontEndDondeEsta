import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const Addarm = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("global");
  return (
    <div>
      <button onClick={() => i18n.changeLanguage("es")}>ES</button>
      <button onClick={() => i18n.changeLanguage("en")}>EN</button>
      <br />
      <input type="text" placeholder={t("add.add")} />
      <button>{t("btn1.btn1")}</button>
      <button onClick={() => navigate("/AdjuntarHabitacion")}>
        {t("btn2.btn2")}
      </button>
    </div>
  );
};

export default Addarm;
