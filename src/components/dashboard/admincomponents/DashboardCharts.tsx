import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

/**
 * 1. Revenue Analytics Chart (Multi-line Area Chart)
 */
export const RevenueAnalyticsChart = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorOrd" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
            dy={10}
            tickFormatter={(val) => val.split('-')[2]}
        />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
        <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#f97316"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorRev)"
        />
        <Area
          type="monotone"
          dataKey="orders"
          stroke="#fbbf24"
          strokeWidth={2}
          strokeDasharray="5 5"
          fillOpacity={1}
          fill="url(#colorOrd)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

/**
 * 2. Monthly Target Gauge (Semi-circle)
 */
export const MonthlyTargetGauge = ({ percent }: { percent: number }) => {
  const data = [
    { name: 'Progress', value: percent },
    { name: 'Remaining', value: 100 - percent },
  ];
  const COLORS = ['#f97316', '#f1f5f9'];

  return (
    <div className="relative w-full h-[180px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="200%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={0}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-[110px] text-center">
        <span className="text-3xl font-black text-slate-800">{percent}%</span>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">+8.02% from last month</p>
      </div>
    </div>
  );
};

/**
 * 3. Top Categories Donut
 */
export const CategoryDonutChart = ({ data }: { data: any[] }) => {
  const COLORS = ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={90}
          paddingAngle={8}
          dataKey="revenue"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
          <Label
            value={`$${data.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString()}`}
            position="center"
            className="fill-slate-800 text-xl font-black"
          />
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

/**
 * 4. Conversion Funnel Chart (Horizontal Bars)
 */
export const ConversionFunnelChart = ({ data }: { data: any }) => {
  const funnelData = [
    { name: 'Views', value: data.views, fill: '#ffedd5' },
    { name: 'Cart', value: data.cart, fill: '#fed7aa' },
    { name: 'Checkout', value: data.checkout, fill: '#fdba74' },
    { name: 'Purchased', value: data.purchased, fill: '#fb923c' },
  ];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={funnelData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
        <Tooltip />
        <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
          {funnelData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

/**
 * 5. Traffic Sources (Horizontal Bar)
 */
// export const TrafficSourcesChart = () => {
//     // Mocked as requested for dynamic feel
//     const data = [
//       { name: 'Direct', value: 40, fill: '#f97316' },
//       { name: 'Organic', value: 30, fill: '#fb923c' },
//       { name: 'Social', value: 15, fill: '#fdba74' },
//       { name: 'Referral', value: 10, fill: '#fed7aa' },
//       { name: 'Email', value: 5, fill: '#ffedd5' },
//     ];
  
//     return (
//       <div className="space-y-4">
//         {data.map((item) => (
//           <div key={item.name} className="space-y-1">
//             <div className="flex justify-between text-xs font-bold text-slate-600 uppercase tracking-tighter">
//               <span>{item.name}</span>
//               <span>{item.value}%</span>
//             </div>
//             <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
//                 <div 
//                     className="h-full rounded-full transition-all duration-1000" 
//                     style={{ width: `${item.value}%`, backgroundColor: item.fill }}
//                 />
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   };

/**
 * 6. Order Distribution Pie Chart
 */
export const OrderDistributionPieChart = ({ data }: { data: any }) => {
  const pieData = [
    { name: 'Completed', value: data?.completed || 0 },
    { name: 'Pending', value: data?.pending || 0 },
    { name: 'Other', value: Math.max(0, (data?.total || 0) - (data?.completed || 0) - (data?.pending || 0)) },
  ];
  const COLORS = ['#10b981', '#f59e0b', '#94a3b8'];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {pieData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

/**
 * 7. Top Selling Products Bar Chart
 */
export const TopProductsBarChart = () => {
  const data = [
    { name: 'iPhone 15', sales: 4000 },
    { name: 'MacBook Pro', sales: 3000 },
    { name: 'Sony Headphones', sales: 2000 },
    { name: 'Nike Air Max', sales: 2780 },
    { name: 'Samsung TV', sales: 1890 },
  ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
        <Bar dataKey="sales" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
};

