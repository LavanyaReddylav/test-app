export interface AttendanceReportData {
    at: string
    checkin: {
        image: string,
        latitude: string,
        longitude: string,
        remarks: string,
        time: string,
        updated_by: string,
    }
    checkout: {
        image: string,
        latitude: string,
        longitude: string,
        remarks: string,
        time: string,
        updated_by: string,
    }
    date: Date,
    name: string,
    reason: string,
    source: string,
    status: string,
    user: string,
    _id: string
}