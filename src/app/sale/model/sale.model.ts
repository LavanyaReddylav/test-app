export interface SalesData {
    beat: string,
    client_dv_code: number,
    counter_address: {
        locality: string,
        pincode: string,
        sco: string
    }

    counter_code: number,
    counter_name: string,
    date: Date,
    distributor_code: number,
    distributor_email: string,
    distributor_name: string,
    division: string,
    dvcode: string,
    name: string,
    order: {
        distributor: number,
        quantity: number,
        sku_code: string

    }

    order_id: string,
    order_placed: boolean,
    reason: string
    sku: string,
    user: string,
    _id: string
}