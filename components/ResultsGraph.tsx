import React, {useContext} from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SettingsContext from "@utils/settingsContext";
import { ProgressSnapShot } from "@app/page";

const ResultsGraph = ({ data }: {data: ProgressSnapShot[]}) => {
    const desiredLabelCount = 25;
    const interval = Math.ceil(data.length / desiredLabelCount);
    const {settings} = useContext(SettingsContext);
    return (
        <ResponsiveContainer width="100%" height={350}>
            <LineChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 80 }}
            >
                <CartesianGrid stroke={settings.bgLightColor} />
                <XAxis 
                    dataKey="time" 
                    axisLine={{ stroke: settings.titleColor, strokeWidth: 3 }}  // Color and width of the X-axis line
                    tickLine={false} 
                    tick={{ //axis label
                        fill: settings.titleColor,         // Label color
                        fontSize: 14,         // Font size
                        fontFamily: 'Nunito',  // Font family
                    }}
                    //format labels to include last label and at most 25 lables
                    tickFormatter={(value, index) => {
                        if (index === data.length - 1) {
                            return value;
                        }
                        return index % interval === 0 ? value : '';
                    }}  
                    label={{ //axis name
                        value: 'Time (seconds)',   
                        position: 'insideBottom',   
                        offset: -20,                   
                        fill: settings.titleColor,                
                        fontSize: 18,               
                        fontFamily: 'Arial',          
                    }}
                />

                <YAxis 
                    axisLine={{ stroke: settings.titleColor, strokeWidth: 3 }}  // Color and width of the Y-axis line
                    tickLine={false} 
                    tick={{ 
                        fill: settings.titleColor,         
                        fontSize: 14,            
                        fontFamily: 'Nunito',  
                    }}
                    label={{ 
                        value: 'Words per Minute',   
                        angle: -90,                  
                        position: 'outsideLeft',       
                        dx: -20,                 
                        fill: settings.titleColor,            
                        fontSize: 18,                
                        fontFamily: 'Nunito',          
                    }}
                />
                <Tooltip  
                    contentStyle={{ backgroundColor: settings.bgLightColor, borderColor: settings.bgLightColor }}
                    itemStyle={{ color: settings.titleColor }}/>
                <Line type="monotone" dataKey="wpm" stroke={settings.titleColor} strokeWidth={2} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default ResultsGraph;
