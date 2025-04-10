import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import PropTypes from "prop-types"

const chartConfig = {
  registrations: {
    label: "Sinh viên",
  },
  grade_1: {
    label: "khóa 20",
    color: "hsl(var(--chart-1))",
  },
  grade_2: {
    label: "khóa 21",
    color: "hsl(var(--chart-2))",
  },
  grade_3: {
    label: "khóa 22",
    color: "hsl(var(--chart-3))",
  },
  grade_4: {
    label: "khóa 23",
    color: "hsl(var(--chart-4))",
  },
  grade_5: {
    label: "khóa 24",
    color: "hsl(var(--chart-5))",
  },
  other: {
    label: "khóa khác",
    color: "hsl(var(--chart-6))",
  },
}

export function EventChart(props) {
  let percentJonined = props.totalRegistrations / props.maxRegistrations * 100 || 0;
  
  const colors = {
    Course_20: "var(--color-grade_1)",
    Course_21: "var(--color-grade_2)",
    Course_22: "var(--color-grade_3)",
    Course_23: "var(--color-grade_4)",
    Course_24: "var(--color-grade_5)",
    Other: "var(--color-other)",
  };
  
  const gradeMapping = {
    Course_20: "Khóa 20",
    Course_21: "Khóa 21",
    Course_22: "Khóa 22",
    Course_23: "Khóa 23",
    Course_24: "Khóa 24",
    Other: "Other"
  };
  
  const chartData = props.studentByCourse
  ? Object.entries(props.studentByCourse).map(([key, value]) => ({
      grade: gradeMapping[key] || key,
      registrations: value,
      fill: colors[key] || "var(--color-default)",
    }))
  : []; // Nếu data null hoặc undefined, trả về mảng rỗng

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card className={props.maxRegistrations === -1 ? "col-span-3" : "col-span-2"}>
        <CardHeader>
          <CardTitle>Số lượng sinh viên tham gia theo khóa</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="grade"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="registrations"
                strokeWidth={2}
                radius={8}
                activeBar={({ ...props }) => {
                  return (
                    <Rectangle
                      {...props}
                      fillOpacity={0.8}
                      // eslint-disable-next-line react/prop-types
                      stroke={props.payload.fill}
                      strokeDasharray={4}
                      strokeDashoffset={4}
                    />
                  )
                }}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      
      {props.maxRegistrations !== -1 && (
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Tổng số lượng đã đăng ký</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center m-auto">
            <div className="radial-progress bg-blue-50 border-8 border-blue-50 text-blue-500 text-sm font-medium"
              style={{ "--value": `${percentJonined}`, "--size": "18rem", "--thickness": "2rem" }} 
              aria-valuenow={percentJonined} role="progressbar">{props.totalRegistrations}/{props.maxRegistrations} sinh viên</div>
          </CardContent>
        </Card>
        )}
    </div>
  )
}


EventChart.propTypes = {
  maxRegistrations: PropTypes.number,
  studentByCourse: PropTypes.object,
  totalRegistrations: PropTypes.number,
}