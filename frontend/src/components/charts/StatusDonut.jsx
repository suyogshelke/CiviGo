import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { tooltipStyle } from './chartTheme';
import { STATUS_META } from '../../utils/constants';

const VARIANT_HEX = {
  secondary: '#94a3b8',
  info: '#00f2fe',
  primary: '#38bdf8',
  warning: '#f59e0b',
  success: '#10b981',
  dark: '#475569',
  danger: '#ef4444',
};

/** Donut of complaints by status, coloured to match the status badges. */
export default function StatusDonut({ data, height = 300 }) {
  const coloured = data.map((d) => ({
    ...d,
    fill: VARIANT_HEX[STATUS_META[d.key]?.variant] || '#94a3b8',
    name: STATUS_META[d.key]?.label || d.name,
  }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={coloured}
          dataKey="value"
          nameKey="name"
          innerRadius="58%"
          outerRadius="82%"
          paddingAngle={3}
          stroke="rgba(8, 14, 26, 0.8)"
          strokeWidth={2}
        >
          {coloured.map((d, i) => (
            <Cell key={i} fill={d.fill} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10, color: '#94a3b8' }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

