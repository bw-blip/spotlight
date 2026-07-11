import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Path, Circle, Line, Text as SvgText } from "react-native-svg";
import { useColors } from "@/hooks/useColors";

interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  color?: string;
  width?: number;
  height?: number;
  minValue?: number;
  maxValue?: number;
}

export function LineChart({
  data,
  color,
  width = 300,
  height = 160,
  minValue = 0,
  maxValue = 10,
}: LineChartProps) {
  const colors = useColors();
  const lineColor = color ?? colors.primary;

  const paddingLeft = 32;
  const paddingRight = 16;
  const paddingTop = 12;
  const paddingBottom = 32;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  if (!data || data.length === 0) {
    return (
      <View style={[styles.empty, { width, height }]}>
        <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
          No data yet
        </Text>
      </View>
    );
  }

  const getX = (index: number) =>
    paddingLeft + (data.length === 1 ? chartWidth / 2 : (index / (data.length - 1)) * chartWidth);

  const getY = (value: number) => {
    const normalized = (value - minValue) / (maxValue - minValue);
    return paddingTop + chartHeight - normalized * chartHeight;
  };

  let pathD = "";
  data.forEach((point, i) => {
    const x = getX(i);
    const y = getY(point.value);
    pathD += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  });

  const yLabels = [0, 2, 4, 6, 8, 10];

  return (
    <Svg width={width} height={height}>
      {yLabels.map((val) => {
        const y = getY(val);
        return (
          <React.Fragment key={val}>
            <Line
              x1={paddingLeft}
              y1={y}
              x2={width - paddingRight}
              y2={y}
              stroke={colors.border}
              strokeWidth={1}
              strokeDasharray="4,4"
            />
            <SvgText
              x={paddingLeft - 4}
              y={y + 4}
              fontSize={9}
              fill={colors.mutedForeground}
              textAnchor="end"
            >
              {val}
            </SvgText>
          </React.Fragment>
        );
      })}

      {data.length > 1 && (
        <Path
          d={pathD}
          stroke={lineColor}
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {data.map((point, i) => {
        const x = getX(i);
        const y = getY(point.value);
        const showLabel = data.length <= 6 || i === 0 || i === data.length - 1;
        return (
          <React.Fragment key={i}>
            <Circle cx={x} cy={y} r={4} fill={lineColor} />
            <Circle cx={x} cy={y} r={2} fill="white" />
            {showLabel && (
              <SvgText
                x={x}
                y={height - paddingBottom + 16}
                fontSize={9}
                fill={colors.mutedForeground}
                textAnchor="middle"
              >
                {point.label.length > 5 ? point.label.slice(0, 5) : point.label}
              </SvgText>
            )}
          </React.Fragment>
        );
      })}
    </Svg>
  );
}

const styles = StyleSheet.create({
  empty: {
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
  },
});
