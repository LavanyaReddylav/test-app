export interface MSM {

    active: string,
    counter: [number],
    division: [string],
    end_date: string,
    msm_category: string,
    msm: [
        {
            sku: string
            target_quantity: number
            _id: string
        }
    ],
    sales_office: [string],
    start_date: string,
    __v: number,
    _id: string

}