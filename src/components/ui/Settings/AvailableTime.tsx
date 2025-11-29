import { useState, useEffect } from "react";
import {
  Card,
  TimePicker,
  Button,
  Space,
  Typography,
  message,
  Spin,
  Alert,
} from "antd";
import moment from "moment-timezone";

import {
  useGetAvailableTimesQuery,
  useUpdateAvailableTimeMutation,
} from "@/redux/apiSlices/availableTimeApi";

const { Title, Text } = Typography;

const AvailableTime = () => {
  const { data, isLoading, isError, error, refetch } =
    useGetAvailableTimesQuery(null);
  const [updateAvailableTime, { isLoading: isUpdating }] =
    useUpdateAvailableTimeMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [userTimezone, setUserTimezone] = useState("");

  // Detect user's timezone
  useEffect(() => {
    const tz = moment.tz.guess();
    setUserTimezone(tz);
  }, []);

  // Initialize values
  useEffect(() => {
    if (!isEditing && data?.data && userTimezone) {
      const start = moment.tz(data.data.startTime, userTimezone);
      const end = moment.tz(data.data.endTime, userTimezone);
      setStartTime(start as any);
      setEndTime(end as any);
    }
  }, [data, userTimezone, isEditing]);

  const handleSubmit = async () => {
    if (!startTime || !endTime) {
      message.warning("Please select both times");
      return;
    }

    const startTimeWithTz = moment
      .tz(
        {
          hour: (startTime as moment.Moment).hour(),
          minute: (startTime as moment.Moment).minute(),
        },
        userTimezone
      )
      .toISOString();

    const endTimeWithTz = moment
      .tz(
        {
          hour: (endTime as moment.Moment).hour(),
          minute: (endTime as moment.Moment).minute(),
        },
        userTimezone
      )
      .toISOString();

    const payload = {
      startTime: startTimeWithTz,
      endTime: endTimeWithTz,
    };

    try {
      await updateAvailableTime(payload).unwrap();
      message.success("Working hours updated successfully");
      setIsEditing(false);
      refetch();
    } catch (err) {
      console.log(err);
      message.error("Update failed");
    }
  };

  const handleCancel = () => {
    if (data?.data) {
      const start = moment.tz(data.data.startTime, userTimezone);
      const end = moment.tz(data.data.endTime, userTimezone);
      setStartTime(start as any);
      setEndTime(end as any);
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        type="error"
        message="Error"
        description={
          (error as any)?.data?.message ||
          (error as any)?.message ||
          "Failed to load"
        }
      />
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 32,
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      <Card
        title={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Title level={4}>Available Working Hours</Title>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            )}
          </div>
        }
      >
        {!isEditing ? (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <Card size="small">
                <Text>Start Time</Text>
                <Title level={3}>
                  {startTime
                    ? (startTime as moment.Moment).format("HH:mm")
                    : "--:--"}
                </Title>
              </Card>
              <Card size="small">
                <Text>End Time</Text>
                <Title level={3}>
                  {endTime
                    ? (endTime as moment.Moment).format("HH:mm")
                    : "--:--"}
                </Title>
              </Card>
            </div>

            <Alert
              message={`Timezone: ${userTimezone} (UTC${moment
                .tz(userTimezone)
                .format("Z")})`}
              type="info"
              showIcon
            />
          </Space>
        ) : (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <div>
                <Text strong>Start Time</Text>
                <TimePicker
                  value={startTime}
                  onChange={(t) => setStartTime(t as any)}
                  format="HH:mm"
                  size="large"
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <Text strong>End Time</Text>
                <TimePicker
                  value={endTime}
                  onChange={(t) => setEndTime(t as any)}
                  format="HH:mm"
                  size="large"
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <Alert
              message={`Timezone: ${userTimezone}`}
              description="Detected automatically"
              type="info"
              showIcon
            />

            <div style={{ display: "flex", gap: 12 }}>
              <Button
                type="primary"
                size="large"
                style={{ flex: 1 }}
                onClick={handleSubmit}
                loading={isUpdating}
              >
                Save
              </Button>
              <Button size="large" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </Space>
        )}
      </Card>
    </div>
  );
};

export default AvailableTime;
