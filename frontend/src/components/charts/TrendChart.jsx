import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { AXIS, GRID, tooltipStyle } from './chartTheme';

/** Submitted vs resolved over the last six months. */
export default function TrendChart({ data, height = 280 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="gSub" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.0} />
          </linearGradient>
          <linearGradient id="gRes" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="month" tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8, color: '#94a3b8' }} />
        <Area type="monotone" dataKey="submitted" name="Submitted" stroke="#38bdf8" strokeWidth={3} fill="url(#gSub)" />
        <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#10b981" strokeWidth={3} fill="url(#gRes)" />

      </AreaChart>
    </ResponsiveContainer>
  );
}
