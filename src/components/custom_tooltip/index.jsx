import { STYLES } from "../../constants/styles";

export const CustomTooltip = ({ active, payload, label, type }) => {
  if (active && payload && payload.length) {
    return (
      <div className={`${STYLES.dark.background.secondary} p-3 border ${STYLES.dark.border.medium} rounded-lg shadow-lg`}>
        <p className={`font-semibold ${STYLES.dark.text.primary}`}>{label}</p>
        <p className={`text-[${STYLES.dark.accent.color}]`}>
          {`${type || "Users"}: ${payload[0].value}`}
        </p>
      </div>
    );
  }
  return null;
};