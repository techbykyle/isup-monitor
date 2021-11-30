import React, { useState } from 'react'
import { useDispatch, shallowEqual, useSelector } from 'react-redux'

const SmallHorizontal = ({device, http, httpAction, isTileFetchingAction, respOk, tile, useHttp, useInterval}) => {
    
    const date = new Date()
    const dispatch = useDispatch()
    const utc_date = date.toLocaleString()
    const [last_checked, setLastChecked] = useState(utc_date)
    const device_controller_state = useSelector(state => state.DeviceController) || {}
    const device_state = useSelector(state => state.DeviceController.data[tile.id], shallowEqual) || {}
    const port = device?.port > 0 && device?.port !== 80 ? `:${device.port}`: ''
    const url = device?.host_name.length > 0 ? `http://${device.host_name}${port}`: `http://${device.ipv4}${port}`
    const user = useSelector(state => state.User)
    const is_fetching_home = isTileFetchingAction(device_controller_state.is_fetching_actions, http['home'], tile.id)
    const home_is_ok = respOk(device_state, http['home'])

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

    if(home_is_ok) {
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

    let icon_span = <span title={title} style={{color}} className='material-icons f60'>{icon}</span>

    if(is_fetching_home) {
        icon_span = <span className="button_loader button_loader_l" style={{margin: '5px 5px 0 5px'}}></span>
    }
        
    return (
        <div style={{height: 70}}>
            <div className="float_l" style={{marginRight: 10}}>
                {icon_span}
            </div>
            <div className="float_l f20">
                <p title={title} className="b">
                    <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                </p>
                <p className="f18">as of {last_checked}</p>
            </div>
        </div>
    )
}

export default SmallHorizontal