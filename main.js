document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for animations (existing code)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = `${index * 150}ms`;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.post-card').forEach(card => {
        observer.observe(card);
    });
});

// --- Start of calculator and page logic ---

// Debounce utility to prevent excessive calculations on input
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Data for calculators and horoscopes
const AVG_HEIGHT_DATA = { female:{20:161.3,30:161.9,40:160.2,50:157.6}, male:{20:174.4,30:174.9,40:173.2,50:170.5} };
const F_ITEMS = [
    {n:"싱잉볼", r:"맑은 소리로 집안의 탁한 기운을 정화하고 안정을 찾으세요.", u:"https://link.coupang.com/a/dyKsFd", i:"https://t4c.coupangcdn.com/thumbnails/remote/212x212ex/image/vendor_inventory/cef7/0bc01026da60025c185c3140e2c75143dfa47f067f2d004af9588d69848d.jpg"},
    {n:"액막이 북어", r:"현관에 걸어 나쁜 기운을 막고 복이 들어오는 길을 지키세요.", u:"https://link.coupang.com/a/dyKusA", i:"https://t5a.coupangcdn.com/thumbnails/remote/212x212ex/image/vendor_inventory/396e/25b4bf5ff64f9001915d9ddc11d88d1b19bfd0cfaf022c3d6994d198d22d.jpg"},
    {n:"장스탠드", r:"구석진 공간에 밝은 조명을 두어 성공운을 환하게 밝히세요.", u:"https://ozip.me/PkR1BgA?af", i:"https://prs.ohou.se/apne2/any/uploads/productions/v1-410686675410944.jpg?w=1280&h=1280&c=c"},
    {n:"카페트", r:"바닥의 온기를 유지하여 집안의 좋은 기운이 새지 않게 가두세요.", u:"https://ozip.me/hxmqIiX?af", i:"https://image.ohousecdn.com/i/bucketplace-v2-development/uploads/productions/169838760927234776.jpg?w=1280&h=1280&c=c"},
    {n:"무드등", r:"따뜻한 빛으로 침실 기운을 안정시키고 행운을 얻으세요.", u:"https://link.coupang.com/a/dyKxh1", i:"https://thumbnail6.coupangcdn.com/thumbnails/remote/212x212ex/image/retail/images/2025/08/28/12/6/6bca4f1b-9de9-4990-8c62-3f50a0833a49.png"},
    {n:"대형 TV", r:"즐거운 파동을 거실에 채워 가족의 소통과 운의 흐름을 돕습니다.", u:"https://link.coupang.com/a/dyKzhL", i:"https://thumbnail6.coupangcdn.com/thumbnails/remote/212x212ex/image/retail/images/2025/10/15/15/2/2816e610-eebc-479c-b994-70880671f140.jpg"},
    {n:"패브릭 소파", r:"부드러운 가구는 휴식의 질을 높여 에너지를 보충해 줍니다.", u:"https://ozip.me/r40SOYF?af", i:"https://image.ohousecdn.com/i/bucketplace-v2-development/uploads/openapi/4167132/1721871518212.jpg?w=1280&h=1280&c=c"},
    {n:"싱그러운 식물", r:"살아있는 생명력을 배치하여 정체된 공간에 생동감을 더하세요.", u:"https://link.coupang.com/a/dyKCdg", i:"https://thumbnail10.coupangcdn.com/thumbnails/remote/212x212ex/image/retail/images/180584597005505-fb4ce459-a8ae-462d-8bda-b4e16cb26501.jpg"},
    {n:"인테리어 시계", r:"질서 있는 흐름을 통해 운이 들어오는 길을 환하게 열어줍니다.", u:"https://link.coupang.com/a/dyKEhn", i:"https://t3a.coupangcdn.com/thumbnails/remote/212x212ex/image/vendor_inventory/d9ee/3273e539fae3caef8f9226d37e77f8849891af26b1eb5f434d636de6c851.png"},
    {n:"실링팬", r:"원활한 공기 소통은 재물과 복이 집안 곳곳으로 퍼지게 합니다.", u:"https://link.coupang.com/a/dyKFkf", i:"https://thumbnail1.coupangcdn.com/thumbnails/remote/212x212ex/image/retail/images/2025/12/08/14/9/0a67a9dc-ecaf-4a9a-971d-51296bc5040c.jpg"},
    {n:"우드 수납장", r:"정리 정돈을 통해 흐트러진 운기를 바로잡고 안정감을 찾으세요.", u:"https://ozip.me/4ARjVhI?af", i:"https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-393417029013504.jpg?w=1280&h=1280&c=c"},
    {n:"홈사우나", r:"따뜻한 기운으로 정체된 혈을 뚫고 복이 들어오는 체질로 바꾸세요.", u:"https://link.coupang.com/a/dyKSYq", i:"https://thumbnail5.coupangcdn.com/thumbnails/remote/212x212ex/image/vendor_inventory/4f94/6c6381ff9643ca814ef14cd915e80d1e36b905111da517b18dc7930d9795.jpg"}
];
const H_TEXTS = [
    "🔱 <b>오늘의 물병자리 분석</b><br>혁신적인 아이디어가 샘솟는 날입니다. 그동안 고민하던 문제의 해결책이 의외의 곳에서 나타납니다.<br>오후 3시경 당신의 창의력이 최고조에 달하니 중요한 기획은 이때 마무리하세요.<br>금전적으로는 지출을 최소화하고 미래를 위한 저축의 기운을 모으는 것이 유리합니다.<br>대인관계에서는 경청하는 태도가 행운을 부르며, 진솔한 대화가 운을 크게 돕습니다.<br>🏠 <b>풍수 조언</b>: 현관을 밝게 유지하고 불필요한 영수증을 즉시 정리하여 복을 맞이하세요.",
    "🌊 <b>오늘의 물고기자리 분석</b><br>직관력이 예리해지는 하루입니다. 당신의 첫 느낌을 믿고 결정하는 것이 좋은 결과를 냅니다.<br>예술적인 감각이 빛을 발하니 취미 활동이나 창작 작업에 몰두하기에 최적의 시기입니다.<br>금전운은 상승세에 있으나 충동적인 쇼핑은 피해야 재물의 기운이 오래 머뭅니다.<br>주변 사람들에게 따뜻한 말 한마디를 건네보세요. 그것이 거대한 행운으로 돌아옵니다.<br>🏠 <b>풍수 조언</b>: 거실 화분의 잎을 정성스럽게 닦아주세요. 식물의 호흡이 곧 당신의 운입니다.",
    "🔥 <b>오늘의 양자리 분석</b><br>넘치는 열정으로 새로운 프로젝트를 시작하기 좋습니다. 당신의 리더십이 빛을 발하는 날입니다.<br>다만 의욕이 앞서 성급한 결정을 내릴 수 있으니, 계약 전에는 신중하게 검토하세요.<br>건강운은 양호하나 하체 근력을 보강하는 운동을 병행하면 신체 활력이 배가됩니다.<br>소중한 친구와의 저녁 식사는 당신에게 새로운 기회와 정보를 가져다줄 것입니다.<br>🏠 <b>풍수 조언</b>: 침실의 조도를 낮추고 따뜻한 색감의 조명을 사용하여 안정의 기운을 높이세요.",
    "🌱 <b>오늘의 황소자리 분석</b><br>끈기와 인내가 빛을 발하는 하루입니다. 꾸준히 노력해온 일에서 소중한 성과를 거두게 됩니다.<br>재물운이 매우 강력하니 투자나 저축 계획을 구체화하기에 더없이 좋은 타이밍입니다.<br>대인관계에서는 고집을 조금 꺾고 주변의 조언을 수용하면 예기치 못한 행운이 찾아옵니다.<br>여유로운 티타임을 통해 내면을 정돈하는 시간을 가지면 금전운이 더욱 상승합니다.<br>🏠 <b>풍수 조언</b>: 주방을 청결하게 유지하세요. 깨끗한 식탁이 집안의 재물복을 불러옵니다.",
    "🗨️ <b>오늘의 쌍둥이자리 분석</b><br>커뮤니케이션 능력이 극대화되는 날입니다. 협상이나 미팅에서 당신의 의견이 관철됩니다.<br>새로운 정보를 얻기에 유리한 날이니 책을 읽거나 세미나에 참여하는 것도 추천합니다.<br>다만 가벼운 실언이 오해를 부를 수 있으니 말하기 전 한 번 더 생각하는 지혜가 필요합니다.<br>이동수가 있으니 여행이나 짧은 외출을 통해 기분을 전환하고 새로운 기운을 얻으세요.<br>🏠 <b>풍수 조언</b>: 거울을 깨끗하게 닦으세요. 맑은 거울이 당신의 사회적 신뢰도를 높여줍니다.",
    "🌙 <b>오늘의 게자리 분석</b><br>감수성이 풍부해지고 가족과의 유대가 깊어지는 날입니다. 집안에 머물며 휴식하는 것이 좋습니다.<br>직관력이 뛰어나 타인의 마음을 잘 읽게 되니 소중한 인연과의 갈등을 해결할 수 있습니다.<br>재물운은 소폭 상승하나 지인을 통한 금전 거래는 신중하게 결정하는 것이 안전합니다.<br>자신만을 위한 소소한 선물을 준비해 보세요. 내면의 에너지가 충전되는 계기가 됩니다.<br>🏠 <b>풍수 조언</b>: 옷장을 정리하세요. 입지 않는 옷을 비워야 새로운 복이 들어올 공간이 생깁니다.",
    "🦁 <b>오늘의 사자자리 분석</b><br>당신의 자신감이 주위 사람들을 매료시키는 날입니다. 주목받는 자리에서 능력을 마음껏 펼치세요.<br>어려운 과제를 해결할 지혜가 생기니 복잡했던 업무를 오늘 깔끔하게 처리할 수 있습니다.<br>금전적으로는 예상치 못한 수입이 생길 수 있으나, 유흥비로 쓰기보다 저축하는 것이 길합니다.<br>건강운이 최고조이니 활동적인 운동을 통해 몸의 순환을 원활하게 만드는 것이 좋습니다.<br>🏠 <b>풍수 조언</b>: 집안 동쪽 방향에 붉은색 소품을 두어 추진력과 성공의 기운을 보강하세요.",
    "💎 <b>오늘의 처녀자리 분석</b><br>정교한 분석력과 세심함이 돋보이는 하루입니다. 작은 실수도 잡아내어 완벽한 성과를 냅니다.<br>계획했던 일을 실천하기에 좋은 날이니 미루어 두었던 청소나 정리를 시작해 보세요.<br>대인관계에서는 냉철함보다는 따뜻한 조언이 상대방에게 더 큰 감동을 주게 됩니다.<br>가벼운 산책을 통해 맑은 공기를 마시면 정체되었던 생각들이 명확하게 정리됩니다.<br>🏠 <b>풍수 조언</b>: 책상을 깔끔하게 비우세요. 정돈된 환경이 당신의 업무운을 극대화합니다.",
    "⚖️ <b>오늘의 천칭자리 분석</b><br>균형과 조화가 완벽하게 이루어지는 날입니다. 갈등이 있던 관계가 자연스럽게 화해로 이어집니다.<br>미적 감각이 뛰어난 날이니 쇼핑이나 방 인테리어를 변경하기에 아주 좋은 타이밍입니다.<br>금전운은 안정적이지만 타인의 부탁을 거절하지 못해 손해를 볼 수 있으니 주의하세요.<br>향기가 좋은 차를 마시며 명상하면 당신을 돕는 귀인의 기운이 더욱 강해집니다.<br>🏠 <b>풍수 조언</b>: 욕실의 물기를 제거하고 환기를 시켜 습한 기운을 몰아내야 재물이 새지 않습니다.",
    "🦂 <b>오늘의 전갈자리 분석</b><br>강력한 집중력으로 어려운 일을 돌파해낼 수 있는 날입니다. 당신의 의지가 승리를 부릅니다.<br>비밀스러운 정보나 소식을 듣게 될 수 있는데, 이를 잘 활용하면 큰 이득으로 연결됩니다.<br>금전운은 비밀 투자를 하기에 좋은 날이지만, 충분한 조사가 선행되어야 실패가 없습니다.<br>충분한 수면을 통해 에너지를 비축하세요. 내일의 더 큰 성장을 위한 준비가 필요합니다.<br>🏠 <b>풍수 조언</b>: 침대 머리 방향을 창문 쪽으로 두어 우주의 긍정적인 기운을 직접 받으세요.",
    "🏹 <b>오늘의 사수자리 분석</b><br>모험심이 생기고 시야가 넓어지는 하루입니다. 새로운 분야에 관심을 가지면 행운이 따릅니다.<br>해외 소식이나 낯선 사람과의 만남에서 인생의 큰 영감을 얻게 될 확률이 매우 높습니다.<br>재물운은 유동적이니 큰 지출보다는 현재 자산을 지키며 관망하는 태도가 유리합니다.<br>긍정적인 마음가짐이 주변 사람들에게 전파되어 당신을 돕고자 하는 사람들이 늘어납니다.<br>🏠 <b>풍수 조언</b>: 현관에 밝은 풍경 소리가 나는 종을 달아 나쁜 기운을 쫓고 복을 부르세요.",
    "🏔️ <b>오늘의 염소자리 분석</b><br>책임감 있는 모습으로 주변의 신뢰를 한 몸에 받는 날입니다. 당신의 커리어가 상승합니다.<br>장기적인 목표를 세우기에 아주 좋은 날이니 1년 뒤의 자신의 모습을 구체적으로 그려보세요.<br>금전적으로는 성실함의 대가로 보너스나 작은 선물을 받게 될 기분 좋은 소식이 있습니다.<br>가족과의 따뜻한 대화는 당신에게 가장 큰 힘이 되니 오늘만큼은 일찍 귀가해 보세요.<br>🏠 <b>풍수 조언</b>: 거실에 가족사진을 두어 집안의 화목함과 안정의 기운을 단단하게 다지세요."
];

// Functions for page features
// Exposed to global window object to be accessible by inline `on...` attributes
async function initCounter() {
    const ns = "borareview_v_final_layout";
    const kst = new Intl.DateTimeFormat('ko-KR', {timeZone:'Asia/Seoul', year:'numeric', month:'2-digit', day:'2-digit'}).format(new Date()).replace(/\. /g, '').replace(/\./g, '');
    try {
        const tR = await fetch(`https://api.counterapi.dev/v1/${ns}/total/up`); const tD = await tR.json(); document.getElementById('tt').innerText = tD.count.toLocaleString();
        const dR = await fetch(`https://api.counterapi.dev/v1/${ns}/today_${kst}/up`); const dD = await dR.json(); document.getElementById('ct').innerText = dD.count.toLocaleString();
    } catch(e) { 
        document.getElementById('ct').innerText="1"; 
        document.getElementById('tt').innerText="1,000+"; 
    }
}
window.initCounter = initCounter;

function calc() {
    const g = document.getElementById('gender').value;
    const a = document.getElementById('age').value;
    const h = parseFloat(document.getElementById('h').value);

    if(h > 0 && h < 300) { // Basic validation
        const avg = AVG_HEIGHT_DATA[g][a];
        const diff = (h-avg).toFixed(1);
        document.getElementById('msg').innerHTML = `평균 키: <b>${avg}cm</b> (${diff>=0 ? diff+'cm 큼' : Math.abs(diff)+'cm 작음'})`;
        document.getElementById('std').innerText = (Math.pow(h/100,2)*22).toFixed(1)+"kg";
        document.getElementById('beauty').innerText = (Math.pow(h/100,2)*19).toFixed(1)+"kg";
    } else {
        // Reset if input is invalid or empty
        document.getElementById('msg').innerText = '키를 입력해 주세요.';
        document.getElementById('std').innerText = "-";
        document.getElementById('beauty').innerText = "-";
    }
}
window.calc = calc;

function bmi() {
    const h = parseFloat(document.getElementById('bh').value) / 100;
    const w = parseFloat(document.getElementById('bw').value);
    const brElem = document.getElementById('br');
    const catElem = document.getElementById('bmi-category');
    const boxElem = document.getElementById('bmi-result-box');

    boxElem.className = 'res-box'; // Reset class

    if(h > 0 && w > 0 && h < 3 && w < 500) { // Basic validation
        const bmiVal = w / (h * h);
        brElem.innerText = bmiVal.toFixed(1);

        let category = '';
        let categoryClass = '';

        if (bmiVal < 18.5) {
            category = '저체중';
            categoryClass = 'underweight';
        } else if (bmiVal < 23) {
            category = '정상';
            categoryClass = 'normal';
        } else if (bmiVal < 25) {
            category = '과체중';
            categoryClass = 'overweight';
        } else {
            category = '비만';
            categoryClass = 'obese';
        }
        catElem.innerText = category;
        boxElem.classList.add(categoryClass);

    } else {
        // Reset if inputs are invalid or empty
        brElem.innerText = "0.0";
        catElem.innerText = "";
    }
}
window.bmi = bmi;

function show() {
    const s = document.getElementById('z').value;
    const t = document.getElementById('ht');
    const l = document.getElementById('la');
    if(s) {
        t.style.display = 'block';
        const idx = parseInt(s) - 1;
        t.innerHTML = H_TEXTS[idx];
        const item = F_ITEMS[idx % F_ITEMS.length];
        l.innerHTML = `<a href="${item.u}" target="_blank" class="lucky-card"><img src="${item.i}"><div class="lucky-txt"><span style="font-size:0.75rem; color:var(--point-pink); font-weight:700;">🏠 추천: ${item.n}</span><br><span style="font-size:0.9rem;">✨ ${item.r}</span></div><div class="go-btn">></div></a>`;
    } else { 
        t.style.display='none'; 
        l.innerHTML=''; 
    }
}
window.show = show;

// Create and expose debounced functions for inline event handlers
window.debouncedCalc = debounce(calc, 500);
window.debouncedBmi = debounce(bmi, 500);