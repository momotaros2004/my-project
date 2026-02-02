import React,{useEffect,useState} from "react";
import "./SAWResult.css";

const criteria = [
 {key:"performance",label:"Performance"},
 {key:"price_score",label:"Price Fit"},
 {key:"upgrade_score",label:"Upgradeability"},
 {key:"efficiency",label:"Efficiency / Noise"}
];

const tierWeights = {
 low:{performance:0.35,price_score:0.45,upgrade_score:0.15,efficiency:0.05},
 mid:{performance:0.45,price_score:0.25,upgrade_score:0.20,efficiency:0.10},
 high:{performance:0.55,price_score:0.10,upgrade_score:0.20,efficiency:0.15}
};

function SAWResult(){

const [coms,setComs]=useState([]);

useEffect(()=>{
 setComs(JSON.parse(localStorage.getItem("saw_results"))||[]);
},[]);

const top3=coms.slice(0,3);

return(

<div className="result-container">

<h2>SAW Calculation</h2>

<table className="saw-table">

<thead>
<tr>
<th>Criteria</th>
<th>อันดับ 1</th>
<th>อันดับ 2</th>
<th>อันดับ 3</th>
</tr>
</thead>

<tbody>

{criteria.map(c=>{

const w=tierWeights[
 c.key==="performance"?"high":
 c.key==="price_score"?"low":"mid"
];

return(

<tr key={c.key}>
<td>{c.label}</td>

{top3.map(pc=>(
<td key={pc.id}>
{(
 pc[c.key]*
 w[c.key]
).toFixed(2)}
</td>
))}

</tr>

);

})}

<tr className="total-row">

<td>TOTAL</td>

{top3.map(pc=>(
<td key={pc.id}>{pc.total.toFixed(2)}</td>
))}

</tr>

</tbody>

</table>

<h2>Top 3 Result</h2>

<div className="result-grid">

{top3.map((c,i)=>(

<div className={`result-card rank-${i+1}`} key={c.id}>

<h3>อันดับ {i+1}</h3>

<p>{c.name}</p>
<p>CPU {c.cpu}</p>
<p>GPU {c.gpu}</p>
<p>RAM {c.ram}</p>

<b>{c.total.toFixed(2)}</b>

<button className="buy-btn">สั่งซื้อ</button>

</div>

))}

</div>

</div>

)

}

export default SAWResult;

