import React from "react";
import { mainSectionStyles as ds } from "../../../styles/dashboardStyles";
import { useState, useEffect } from "react";
import { creditDashboardCounts, loadDashboardCounts, studentStatusCounts, teachersAbsentToday, teachersMonthAttendance } from "../../../api/adminAPI";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LabelList, PieChart, Pie, Cell, Legend  } from "recharts";
import { gridStyle, title } from "../../../styles/componentsStyle";
import StatCard from "../../../componenets/StatCard";
import { LayoutGrid, PersonStanding, UserStar } from "lucide-react";

const AdminDashboard = () => {
  const [ counts, setCounts ] = useState([])
  const [ credit, setCredit ] = useState([])
  const [ studentStatus, setStudentStatus ] = useState([])
  const [ teachersAttendance, setTeachersAttendance ] = useState([])
  const [ teachersAbsent, setTeachersAbsent ] = useState([])
  
  useEffect(()=>{
    loadDashboardCounts({ setCounts })
    creditDashboardCounts({ setCredit })
    studentStatusCounts({ setStudentStatus })
    teachersMonthAttendance({ setTeachersAttendance })
    teachersAbsentToday({ setTeachersAbsent })
  },[])

 const stats = [
    {
      title: "Total Students",
      value: `${Number(counts?.total_students || 0)}`,
      icon: <PersonStanding className="w-8 h-8 text-emerald-500" />,
      gradient: "from-emerald-500/10 to-emerald-500/5",
    },
    {
      title: "Total Classes",
      value: `${Number(counts?.total_classes || 0)}`,
      icon: <LayoutGrid className="w-8 h-8 text-indigo-500" />,
      gradient: "from-indigo-500/10 to-indigo-500/5",
    },
    {
      title: "Active Teachers",
      value: `${Number(counts?.total_teachers || 0)}`,
      icon: <UserStar className="w-8 h-8 text-amber-500" />,
      gradient: "from-amber-500/10 to-amber-500/5",
    },
    {
      title: "Active Classes",
      value: `${Number(counts?.total_classes || 0)}`,
      icon: <LayoutGrid className="w-8 h-8 text-pink-500" />,
      gradient: "from-pink-500/10 to-pink-500/5",
    },
  
  ];

  return (
    <>

      <div className={ds.grid}>
        {stats.map((stat, i) => (
          <StatCard
            key={i}
            index={i}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            gradient={stat.gradient}
          />
        ))}
      </div>
      
      <div className={gridStyle.item2atRow}>
        <StudentStatusPieChart data={studentStatus} />
        <AbesentTeachersToday data={teachersAbsent} />
      </div>
      <div className="p-2">
        <MixBarChart teacherAttendance={teachersAttendance}/>
      </div>
      <div className="p-2">
        <TeacherCreditChart teacherData={credit} />
      </div>
      <br />
      {/* <div className={ds.section}>
        <h2 className={ds.sectionTitle}>Recent Activities</h2>
      </div> */}
    </>
  );
};

export default AdminDashboard;



const TeacherCreditChart = ({ teacherData }) => {
const tailwindColors = ["#86efac", "#93c5fd", "#f9a8d4", "#fde68a", "#c4b5fd", "#fdba74", "#67e8f9", "#fca5a5", "#6ee7b7", "#fcd34d", 
  "#a5b4fc", "#f0abfc", "#fef08a", "#fbbfca", "#6ee7b7", "#93c5fd"];
  // Ensure total_credits is numeric
  const chartData = teacherData.map((t, index) => ({
    ...t,
    total_credits: Number(t.total_credits),
    fill: tailwindColors[index % tailwindColors.length], // rotate colors
    label: `${t.firstname} (${t.total_credits})` // label with credits
  }));
  // Custom Bar Shape component (triangle)
  const CustomBarShape = ({ x, y, width, height, fill }) => (
    <path d={`M${x},${y + height} L${x + width / 2},${y} L${x + width},${y + height} Z`} fill={fill} />
  );

  return (
    <div>
      <h2 className={title.h1}>Teachers Credits</h2>
      <div style={{ width: "100%" }} className="bg-white rounded-xl shadow-md py-4 px-2">
        <ResponsiveContainer width="100%" minHeight={400}>
          <BarChart
            data={chartData}
            margin={{ top: 40, right: 30, left: 0, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="firstname"
              angle={-45}
              textAnchor="end"
              interval={0}
              tickFormatter={(value, index) => chartData[index].label} // show name + credits
            />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} credits in a week`, "Total"]} />
            <Bar
              dataKey="total_credits"
              // shape={<CustomBarShape />}
            >
              <LabelList dataKey="total_credits" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const StudentStatusPieChart = ({ data }) => {
  // Convert object into array suitable for PieChart
  const chartData = [
    { name: "Active", value: Number(data.totalActive) },
    { name: "Pending", value: Number(data.totalPending) },
    { name: "Inactive", value: Number(data.totalInactive) },
    { name: "3 Parcha", value: Number(data.totalCParcha) },
  ];

  const COLORS = [ "#86efac", "#fde68a", "#fca5a5", "#93c5fd" ];

  // Custom label for the pie slices
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={12} fontWeight="bold">
        {`${chartData[index].name} (${chartData[index].value})`}
      </text>
    );
  };

  return (
  <div>
    <h2 className={title.h1}>Students Report</h2>
    <div className="w-full flex justify-center rounded-xl shadow-md bg-white">
      <PieChart width={400} height={400}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          // outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend 
            layout="horizontal"       // stack items vertically
            verticalAlign="top"  // center vertically
            align="left"           // align to right side
            iconType="circle"       // circle icons
            wrapperStyle={{  width:"100%", left: 0,top: 0, padding: 20 }} // optional spacing
          />

      </PieChart>
    </div>
  </div>
  );
};

const MixBarChart = ({ teacherAttendance }) => {
  // Convert string numbers to actual numbers
  const chartData = teacherAttendance.map(t => ({
    ...t,
    Present: Number(t.total_present),
    Absent: Number(t.total_absent),
    Leave: Number(t.total_leave),
    Days: Number(t.total_days)
  }));

  // Tailwind-inspired smooth colors
  const colors = { present: "#86efac", absent: "#fca5a5", leave: "#fde68a"};
  return (
    <div>
       <h2 className={title.h1}>Teacher Attendance Report</h2>
      <div style={{ width: "100%", height: 400 }} className="bg-white rounded-xl shadow-md pt-4">
        <ResponsiveContainer>
          <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="teacher_name"
                angle={-45}
                textAnchor="end"
                interval={0}
              />
              <YAxis />
              <Tooltip />
              <Legend
                verticalAlign="top"
                align="center"
                wrapperStyle={{ marginTop: -20 }}
              />

              <Bar dataKey="Present" fill={colors.present} stackId="a">
                <LabelList dataKey="Present" position="top" />
              </Bar>
              <Bar dataKey="Absent" fill={colors.absent} stackId="a">
                {/* <LabelList dataKey="Absent" position="top" /> */}
              </Bar>
              <Bar dataKey="Leave" fill={colors.leave} stackId="a">
                {/* <LabelList dataKey="Leave" position="top" /> */}
              </Bar>
            </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const AbesentTeachersToday = ({ data })=>{
  return(
    <div>
      <h2 className={title.h1}>Teachers Attendance</h2>
      <div className="bg-white p-4 h-100 rounded-xl shadow-md overflow-y-auto">
        {data?.length ? data.map(item=>(
          <p key={item.user_code} className={`border ${item.status=="present"?"border-green-400":item.status=="leave"?"border-amber-400":"border-red-300"} p-2 mb-2 rounded-md`}>
            {item.status=="present"?"✅": item.status=="leave"?"⚠️":"🚫"} {item.user_code} Teacher <span className="font-bold">{item.teacher_name}</span> is {item.status} today
          </p>
        ))
        :
        <p  className={`border "border-green-400 p-2 mb-2 rounded-md`}>
          Empty Teacher Attendance
        </p>
      }
      </div>
    </div>
  )
}