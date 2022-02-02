/*  Demo Content for EditLineDoc */

export const editListDemoContent = `<ol class="turbo-ol-level1" style="counter-reset: l1 3;">
<li>пункт A</li>
<li>пункт A
    <ol class="turbo-ol-level2" style="counter-reset: l2 2;">
        <li>пункт B</li>
        <li>пункт B
            <ol class="turbo-ol-level3">
              <li>Punkt C</li>
              <li>Punkt C</li>
             </ol>
         </li>
    </ol>
</li>
<li style="counter-increment: l1 4;">пункт А
  <ol class="turbo-ol-level2" style="counter-reset: l2 6;">
        <li>пункт B
             <ol class="turbo-ol-level3" style="counter-reset: l3 9;">
              <li>Punkt C</li>
              <li>Punkt C</li>
            </ol>
        </li>
        <li>пункт B</li>
        <li style="counter-reset: l2 4;">пункт B</li>
        <li>пункт B</li>
    </ol>
</li>
<li>пункт A</li>
<li> Пункт A</li>
<li style="counter-increment: l1 4;"> Пункт A</li>
<li>пункт A</li>
<li>пункт A</li>
</ol>`

export default editListDemoContent;
