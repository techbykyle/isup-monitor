import React, { useState } from 'react'
import { useDispatch, shallowEqual, useSelector } from 'react-redux'

const SmallHorizontal = ({device, http, httpAction, tile, useHttp, useInterval}) => {
    
    const date = new Date()
    const dispatch = useDispatch()
    const utc_date = date.toLocaleString()
    const [last_checked, setLastChecked] = useState(utc_date)
    const device_state = useSelector(state => state.DeviceController.data[tile.id], shallowEqual) || {}
    const port = device?.port > 0 && device?.port !== 80 ? `:${device.port}`: ''
    const url = device?.host_name.length > 0 ? `http://${device.host_name}${port}`: `http://${device.ipv4}${port}`
    const user = useSelector(state => state.User)

    let is_up = false
    let icon = 'verified'
    let color = '#6fc796'
    let title = `${url} is up`

    useHttp(device.id, tile.id, http['home'])

    useInterval(() => {

        const date_Interval = new Date()
        const utc_date_interval = date_Interval.toLocaleString()

        setLastChecked(utc_date_interval)

        httpAction(dispatch, user.token, device.id, tile.id, http['home'])
    }, 60000)

    if(device_state[http['home']]?.status === 200) {
        is_up = true
    }

    if(!is_up) {
        icon = 'arrow_circle_down'
        color = '#f59598'
        title = `${url} is DOWN! `

        if(device_state.error) {
            title = title + device_state.message
        }
    }
        
    return (
        <div style={{height: 70}}>
            <div className="float_l" style={{marginRight: 10}}>
                <span title={title} style={{color}} className='material-icons f60'>{icon}</span>
            </div>
            <div className="float_l f20">
                <p title={title} className="b">{url}</p>
                <p className="f18">as of {last_checked}</p>
            </div>
        </div>
    )
}

export default SmallHorizontal