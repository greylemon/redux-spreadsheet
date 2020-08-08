import React, { FunctionComponent } from 'react'
// import { BrowserRouter, Link, Route, Switch } from 'react-router-dom'
import { Excel } from '../src/Excel'

const AppExcel: FunctionComponent = () => {
  return (
    <div>
      <Excel />
    </div>
  )
}

// const AppOther: FunctionComponent = () => {
//   return (
//     <div>
//       <Link to="/excel">Excel</Link>
//     </div>
//   )
// }

// const AppContent: FunctionComponent = () => {
//   return (
//     <Switch>
//       <Route path="/excel" component={AppExcel} />
//       <Route exact path="/" component={AppOther} />
//     </Switch>
//   )
// }

// const App: FunctionComponent = () => {
//   return (
//     <BrowserRouter>
//       <Switch>
//         <Route path="/" component={AppContent} />
//       </Switch>
//     </BrowserRouter>
//   )
// }

export default AppExcel
