package services

import (
	"context"
	"errors"
	"fmt"
	"local_packages/api/types"
	"time"
)

type Stats struct {
    Calls    float64
    Errors  float64
    Latency float64
}

func (s *Service) GetLast7DaysStatistics(ctx context.Context, endpointIDs []int) ([]map[string]interface{}, error) {
    result := make([]map[string]interface{}, 7)
    currentDate := time.Now()

    for i := 0; i < 7; i++ {
        date := currentDate.AddDate(0, 0, -i)

        dayStats := make(map[string]interface{})
        dayStats["name"] = date.Weekday().String()

        for _, endpointID := range endpointIDs {
            // Use a struct to hold retrieved data
            var stats Stats 

            err := s.gormDB.Table("usage_log_entities").
                Select("COALESCE(COUNT(id), 0) as calls, COALESCE(AVG(CASE WHEN status >= 500 THEN 1 ELSE 0 END), 0) as errors, COALESCE(AVG(response_time), 0) as latency").
                Where("endpoint_id = ? AND DATE(timestamp) = ?", endpointID, date.Format("2006-01-02")).
                Scan(&stats).Error

            if err != nil {
                return nil, err
            }

            // Handle no data found case
            if stats.Calls == 0 && stats.Errors == 0 && stats.Latency == 0 {
                dayStats[fmt.Sprintf("%d", endpointID)] = nil
            } else {
                dayStats[fmt.Sprintf("%d", endpointID)] = map[string]float64{
                    "Calls": stats.Calls,
                    "Errors": float64(stats.Errors * 100), // Multiply by 100 for percentage
                    "Latency": stats.Latency,
                }
            }
        }

        result[i] = dayStats
    }

    return result, nil
}



func (s *Service) GetStatisticsByTimeFilter(ctx context.Context, endpointStatDto types.EndpointStatDto) ([]map[string]interface{}, error) {
    var intervals int
    var format string

    switch endpointStatDto.TimeFilter {
    case "7d":
        intervals = 7
        format = "2006-01-02"
    case "30d":
        intervals = 15
        format = "2006-01-02"
    case "90d":
        intervals = 15
        format = "2006-01-02"
    case "1h":
        intervals = 15
        format = "15:04"
    case "3h":
        intervals = 15
        format = "15:04"
    case "6h":
        intervals = 12
        format = "15:04"
    case "12h":
        intervals = 12
        format = "15:04"
    case "24h":
        intervals = 12
        format = "15:04"
    default:
        return nil, errors.New("unsupported time filter")
    }

    result := make([]map[string]interface{}, intervals)
    currentDate := time.Now()

    switch endpointStatDto.TimeFilter {
    case "1h","3h","6h","12h", "24h":
   

    for i := 0; i < intervals; i++ {
        date := currentDate.Add(-time.Duration(i) * getDurationForTimeFilter(endpointStatDto.TimeFilter, intervals))

        dayStats := make(map[string]interface{})
        dayStats["name"] = date.Format(format)

        for _, endpointID := range endpointStatDto.EndpointIDs {
            // Use a struct to hold retrieved data
            var stats Stats

            var startTime, endTime time.Time

            switch endpointStatDto.TimeFilter {
            case "1h":
                startTime = date.Add(-4 * time.Minute)
                endTime = date
            case "3h":
                startTime = date.Add(-20 * time.Minute)
                endTime = date
            case "6h":
                startTime = date.Add(-60 * time.Minute)
                endTime = date
            case "12h", "24h":
                startTime = date.Add(-120 * time.Minute)
                endTime = date
            default:
                startTime = date
                endTime = date
            }

            err := s.gormDB.Table("usage_log_entities").
                Select("COALESCE(COUNT(id), 0) as calls, COALESCE(AVG(CASE WHEN status >= 500 THEN 1 ELSE 0 END), 0) as errors, COALESCE(AVG(response_time), 0) as latency").
                Where("endpoint_id = ? AND timestamp BETWEEN ? AND ?", endpointID, startTime, endTime).
                Scan(&stats).Error

            if err != nil {
                return nil, err
            }

            // Handle no data found case
            if stats.Calls == 0 && stats.Errors == 0 && stats.Latency == 0 {
                dayStats[fmt.Sprintf("%d", endpointID)] = nil
            } else {
                dayStats[fmt.Sprintf("%d", endpointID)] = map[string]float64{
                    "Calls":   stats.Calls,
                    "Errors":  float64(stats.Errors * 100), // Multiply by 100 for percentage
                    "Latency": stats.Latency,
                }
            }
        }

        result[intervals-i-1] = dayStats
    }
    default:
    for i := 0; i < intervals; i++ {
        date := currentDate.Add(-time.Duration(i) * getDurationForTimeFilter(endpointStatDto.TimeFilter, intervals))

        dayStats := make(map[string]interface{})
        dayStats["name"] = date.Format(format)

        for _, endpointID := range endpointStatDto.EndpointIDs {
            // Use a struct to hold retrieved data
            var stats Stats

            err := s.gormDB.Table("usage_log_entities").
                Select("COALESCE(COUNT(id), 0) as calls, COALESCE(AVG(CASE WHEN status >= 500 THEN 1 ELSE 0 END), 0) as errors, COALESCE(AVG(response_time), 0) as latency").
                Where("endpoint_id = ? AND DATE(timestamp) = ?", endpointID, date.Format("2006-01-02")).
                Scan(&stats).Error

            if err != nil {
                return nil, err
            }

            // Handle no data found case
            if stats.Calls == 0 && stats.Errors == 0 && stats.Latency == 0 {
                dayStats[fmt.Sprintf("%d", endpointID)] = nil
            } else {
                dayStats[fmt.Sprintf("%d", endpointID)] = map[string]float64{
                    "Calls":   stats.Calls,
                    "Errors":  float64(stats.Errors * 100), // Multiply by 100 for percentage
                    "Latency": stats.Latency,
                }
            }
        }

        result[intervals-i-1] = dayStats
    }
}


    
    return result, nil
}

func getDurationForTimeFilter(timeFilter string, intervals int) time.Duration {
    switch timeFilter {
    case "7d":
        return 24 * time.Hour
    case "30d":
        return 2 * 24 * time.Hour // Group every 2 days
    case "90d":
        return 4 * 24 * time.Hour // Group every 4 days
    case "1h":
        return 4 * time.Minute
    case "3h":
        return 20 * time.Minute
    case "6h":
        return 60 * time.Minute
    case "12h", "24h":
        return 120 * time.Minute
    default:
        return 0
    }
}

