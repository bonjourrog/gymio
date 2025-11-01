export type ApiResponse<T = any> = {
    success: boolean
    message: string
    type?: 'success' | 'validation' | 'dependency' | 'auth' | 'server'
    data?: T
    code?: string
}
