(() => {
  const $ = id => document.getElementById(id);
  const shuffle = a => [...a].sort(() => Math.random() - .5);
  const clean = s => String(s || '').normalize('NFKC').replace(/[\s　・、。！!？?「」『』（）()]/g, '').replace(/ヶ/g, 'ケ');
  const answerMatches = (value, q) => { const input=clean(value); if(!input)return false; return [q.answer,...(q.aliases||[])].map(clean).some(answer => input===answer || (q.kind&&q.kind.includes('年表')&&input===answer.replace(/年|約|ごろ/g,'')) || (input.length>=3&&answer.startsWith(input)) || (input.length>=2&&answer.endsWith(input))); };
  const groups = {
    '古代（旧石器〜奈良）':['旧石器・縄文','弥生・古墳','飛鳥','奈良'],
    '中世（平安〜戦国）':['平安','鎌倉','室町','安土桃山'],
    '近世（江戸）':['江戸前期','江戸中期','江戸後期'],
    '近代・現代（幕末〜現在）':['幕末・明治','明治・大正','昭和戦前','昭和戦後','現代']
  };
  const base = questions.map(q => ({ era:q[0], level:1, type:'choice', kind:'四択', text:q[1], options:q[2], answer:q[2][q[3]], explain:q[4] }));
  const direct = questions.filter(q => q[2][q[3]].length <= 12 && !/[。、】【]/.test(q[2][q[3]])).map(q => ({era:q[0],level:3,type:'fill',kind:'一問一答',text:q[1]+'。答えを漢字で書こう。',answer:q[2][q[3]],explain:q[4]}));
  const rows = `
旧石器・縄文|旧石器|岩宿遺跡が発見される|約3万年前
旧石器・縄文|縄文|縄文土器が使われる|約1万年前
弥生・古墳|弥生|米づくりが広がる|紀元前4世紀ごろ
弥生・古墳|古墳|大きな前方後円墳が作られる|3世紀後半
飛鳥|飛鳥|仏教が伝わる|538年
飛鳥|飛鳥|冠位十二階が定められる|603年
飛鳥|飛鳥|十七条の憲法が定められる|604年
飛鳥|飛鳥|遣隋使が派遣される|607年
飛鳥|飛鳥|大化の改新が始まる|645年
飛鳥|飛鳥|壬申の乱|672年
飛鳥|飛鳥|平城京に都を移す|710年
奈良|奈良|『古事記』が完成する|712年
奈良|奈良|『日本書紀』が完成する|720年
奈良|奈良|墾田永年私財法|743年
奈良|奈良|東大寺の大仏が完成する|752年
平安|平安|平安京に都を移す|794年
平安|平安|遣唐使を廃止する|894年
平安|平安|平将門の乱|939年
平安|平安|藤原道長が摂政になる|1016年
平安|平安|平清盛が太政大臣になる|1167年
鎌倉|鎌倉|源頼朝が征夷大将軍になる|1192年
鎌倉|鎌倉|承久の乱|1221年
鎌倉|鎌倉|御成敗式目が定められる|1232年
鎌倉|鎌倉|文永の役|1274年
鎌倉|鎌倉|弘安の役|1281年
室町|室町|足利尊氏が京都に幕府を開く|1338年
室町|室町|南北朝が統一される|1392年
室町|室町|金閣が建てられる|1397年
室町|室町|応仁の乱|1467年
安土桃山|安土桃山|鉄砲が伝わる|1543年
安土桃山|安土桃山|キリスト教が伝わる|1549年
安土桃山|安土桃山|長篠の戦い|1575年
安土桃山|安土桃山|太閤検地が始まる|1582年
江戸前期|江戸|関ヶ原の戦い|1600年
江戸前期|江戸|江戸幕府が開かれる|1603年
江戸前期|江戸|大阪夏の陣|1615年
江戸前期|江戸|参勤交代が制度化される|1635年
江戸前期|江戸|鎖国が完成する|1639年
江戸中期|江戸|享保の改革が始まる|1716年
江戸中期|江戸|田沼意次が老中になる|1772年
江戸後期|江戸|寛政の改革が始まる|1787年
江戸後期|江戸|異国船打払令|1825年
江戸後期|江戸|天保の改革が始まる|1841年
幕末・明治|近代|ペリーが浦賀に来航する|1853年
幕末・明治|近代|日米和親条約|1854年
幕末・明治|近代|大政奉還|1867年
幕末・明治|近代|明治維新|1868年
幕末・明治|近代|廃藩置県|1871年
幕末・明治|近代|地租改正|1873年
幕末・明治|近代|大日本帝国憲法発布|1889年
明治・大正|近代|日清戦争|1894年
明治・大正|近代|日露戦争|1904年
明治・大正|近代|韓国併合|1910年
明治・大正|近代|米騒動|1918年
明治・大正|近代|普通選挙法|1925年
昭和戦前|昭和|満州事変|1931年
昭和戦前|昭和|日中戦争が始まる|1937年
昭和戦前|昭和|太平洋戦争が始まる|1941年
昭和戦後|戦後|日本国憲法施行|1947年
昭和戦後|戦後|サンフランシスコ平和条約|1951年
昭和戦後|戦後|国際連合加盟|1956年
昭和戦後|戦後|東京オリンピック|1964年
現代|現代|沖縄の本土復帰|1972年`.trim().split('\n').map(x=>{const [era,period,event,year]=x.split('|');return{era,period,event,year,num:+year.replace(/[^0-9]/g,'')}});
  const time = rows.flatMap((x,i) => {
    const others = shuffle(rows.filter(y => y.event !== x.event));
    const years = shuffle([x.year,...others.slice(0,3).map(y=>y.year)]);
    const events = shuffle([x.event,...others.slice(0,3).map(y=>y.event)]);
    const next = rows.filter(y=>y.num>x.num)[0] || x;
    return [
      {era:x.era,level:2,type:'fill',kind:'年表穴埋め',text:`【${x.period}の年表】${x.year}　（　　　　　　）`,answer:x.event,explain:`${x.year}に${x.event}がありました。`},
      {era:x.era,level:3,type:'fill',kind:'年表穴埋め',text:`【${x.period}の年表】（　　　）　${x.event}`,answer:x.year,aliases:[x.year.replace('約','').replace('ごろ','')],explain:`${x.event}は${x.year}です。`},
      {era:x.era,level:2,type:'choice',kind:'年表・年号',text:`${x.event}が起きた年として正しいものを選びなさい。`,options:years,answer:x.year,explain:`${x.event}は${x.year}です。`},
      {era:x.era,level:3,type:'choice',kind:'年表・前後関係',text:`${x.event}の後、年表上で最も近い出来事はどれですか。`,options:shuffle([next.event,...others.slice(0,3).map(y=>y.event)]),answer:next.event,explain:`${x.event}（${x.year}）の次の重要な出来事は${next.event}（${next.year}）です。`}
    ];
  });
  const facts = `
飛鳥|法隆寺を建てた人物|聖徳太子|飛鳥文化を代表する寺院です。
飛鳥|701年に定められた本格的な法律|大宝律令|律令国家の基本となりました。
奈良|東大寺の大仏造立を進めた天皇|聖武天皇|仏教で国を守ろうとしました。
奈良|戒律を伝えるため来日した僧|鑑真|何度も失明しながら渡日しました。
平安|天台宗を開いた人物|最澄|比叡山延暦寺を中心としました。
平安|真言宗を開いた人物|空海|高野山金剛峯寺を中心としました。
平安|『源氏物語』を書いた人物|紫式部|かな文字を用いた女流文学です。
平安|『枕草子』を書いた人物|清少納言|随筆文学の代表です。
平安|平等院鳳凰堂を建てた人物|藤原頼通|阿弥陀如来像が安置されます。
鎌倉|将軍を助けて政治を行った役職|執権|北条氏が代々この職につきました。
鎌倉|御成敗式目を定めた人物|北条泰時|武士の慣習をもとにした法律です。
鎌倉|浄土宗を開いた人物|法然|念仏を唱えれば救われると説きました。
鎌倉|浄土真宗を開いた人物|親鸞|悪人正機の考えでも知られます。
鎌倉|曹洞宗を開いた人物|道元|座禅を重視しました。
鎌倉|日蓮宗を開いた人物|日蓮|法華経を重視しました。
室町|金閣を建てた将軍|足利義満|北山文化を代表します。
室町|銀閣を建てた将軍|足利義政|東山文化を代表します。
室町|水墨画『秋冬山水図』を描いた人物|雪舟|禅宗の影響を受けた水墨画です。
室町|茶の湯を完成させた人物|千利休|わび茶を大成しました。
安土桃山|安土城を築いた人物|織田信長|天下統一を進めました。
安土桃山|全国の田畑を調べた政策|太閤検地|石高を基準に土地を把握しました。
安土桃山|農民から武器を取り上げた政策|刀狩|兵農分離を進めました。
江戸前期|江戸幕府を開いた人物|徳川家康|1603年に征夷大将軍になりました。
江戸前期|元禄文化を代表する俳人|松尾芭蕉|『奥の細道』を著しました。
江戸前期|『浮世草子』で町人を描いた作家|井原西鶴|元禄文化の作家です。
江戸中期|享保の改革を行った将軍|徳川吉宗|8代将軍です。
江戸中期|『解体新書』を翻訳した人物|杉田玄白|蘭学発展の代表です。
江戸中期|全国を測量して地図を作った人物|伊能忠敬|精密な日本地図を完成させました。
江戸後期|『富嶽三十六景』を描いた人物|葛飾北斎|版画が海外にも影響を与えました。
江戸後期|『東海道中膝栗毛』を書いた人物|十返舎一九|庶民の旅を題材にした滑稽本です。
幕末・明治|五箇条の御誓文を出した天皇|明治天皇|新政府の基本方針を示しました。
幕末・明治|1877年の士族の反乱|西南戦争|西郷隆盛が中心となりました。
幕末・明治|自由民権運動の中心人物|板垣退助|国会開設を求めました。
明治・大正|領事裁判権を撤廃した外相|陸奥宗光|条約改正を前進させました。
明治・大正|民本主義を説いた人物|吉野作造|大正デモクラシー期の思想家です。
昭和戦前|満州事変の後に作られた国|満州国|国際連盟は承認しませんでした。
昭和戦前|日中戦争のきっかけとなった事件|盧溝橋事件|1937年に起きました。
昭和戦後|憲法で象徴とされた存在|天皇|主権は国民にあります。
昭和戦後|1950年からの経済回復のきっかけ|朝鮮特需|朝鮮戦争による特別需要です。
現代|2016年から18歳に引き下げられたもの|選挙権年齢|公職選挙法改正によるものです。
飛鳥|飛鳥時代の日本で、最初の女帝|推古天皇|聖徳太子が摂政として政治を助けました。
飛鳥|大化の改新を進めた中心人物|中大兄皇子|のちの天智天皇です。
飛鳥|中大兄皇子とともに大化の改新を進めた人物|中臣鎌足|のちの藤原氏の祖です。
奈良|『古事記』を編さんさせた天皇|天武天皇|日本の神話や伝承をまとめました。
奈良|地方ごとに置かれ、中央から派遣された役人|国司|地方の政治・税の仕事を担いました。
平安|894年に遣唐使の廃止を提案した人物|菅原道真|国風文化が育つ背景の一つになりました。
平安|『今昔物語集』などに見られる、仏教の末世を恐れる考え|末法思想|阿弥陀信仰が広がる背景になりました。
平安|平氏を滅ぼした最後の戦い|壇ノ浦の戦い|1185年、源氏が勝利して平氏が滅びました。
鎌倉|鎌倉幕府を倒した天皇|後醍醐天皇|建武の新政で天皇中心の政治を試みました。
鎌倉|元寇で元軍が2度目に攻めてきた戦い|弘安の役|1281年の侵攻で、幕府は防衛に成功しました。
鎌倉|鎌倉時代の武士の生活を描いた随筆|徒然草|吉田兼好が書きました。
室町|室町幕府の3代将軍が明と行った貿易|勘合貿易|倭寇と区別するため勘合を用いました。
室町|農民が自治的に運営した村|惣村|寄り合いで惣掟を定めました。
室町|浄土真宗の信者が中心となった一揆|一向一揆|加賀では約100年にわたり支配を行いました。
室町|応仁の乱で東軍の中心となった守護大名|細川勝元|西軍の山名宗全と対立しました。
安土桃山|織田信長が商業を活発にするために行った政策|楽市楽座|市場税を免除し、座の特権を弱めました。
安土桃山|1582年に織田信長を討った人物|明智光秀|本能寺の変を起こしました。
安土桃山|豊臣秀吉が農民から武器を取り上げた政策|刀狩|兵農分離を進める目的がありました。
江戸前期|江戸幕府が大名を統制するために定めた法令|武家諸法度|参勤交代など、大名の行動を規制しました。
江戸前期|キリスト教徒かを調べるために行った取り調べ|踏み絵|キリストや聖母の絵を踏ませました。
江戸前期|島原・天草一揆で象徴的な指導者となった人物|天草四郎|重い年貢とキリスト教弾圧への反発が背景です。
江戸中期|『日本書紀』などの古典を研究する学問|国学|本居宣長が大成しました。
江戸中期|新井白石が6代・7代将軍を助けた政治|正徳の治|貨幣の質を改め、朝鮮通信使を待遇しました。
江戸後期|天保のききんのなかで1837年に起きた反乱|大塩平八郎の乱|大坂で救済の不十分な幕府を批判しました。
江戸後期|外国船を追い払うよう命じた法令|異国船打払令|1825年、外国への警戒から出されました。
江戸後期|ペリー来航の翌年に結ばれた条約|日米和親条約|下田・箱館を開港しました。
幕末・明治|幕府が政権を朝廷に返したこと|大政奉還|1867年、徳川慶喜が行いました。
幕末・明治|新政府軍と旧幕府軍の戦い|戊辰戦争|新政府軍が勝利し、明治政府の支配が固まりました。
幕末・明治|明治政府の基本方針を示した文書|五箇条の御誓文|広く会議を興し、身分を問わず志を遂げることを掲げました。
幕末・明治|1871年に藩を廃止して府県を置いた改革|廃藩置県|中央政府が全国を直接治める基礎になりました。
明治・大正|日清戦争の講和条約|下関条約|清は台湾を割譲し、賠償金を支払いました。
明治・大正|日露戦争の講和条約|ポーツマス条約|日本は賠償金を得られず、国内で反発が起きました。
明治・大正|第一次世界大戦後にドイツへ厳しい賠償などを課した条約|ベルサイユ条約|戦後のドイツ国内の不満にもつながりました。
昭和戦前|1933年に日本が脱退した国際組織|国際連盟|満州事変後の対応をめぐって孤立を深めました。
昭和戦前|第二次世界大戦で日本・ドイツ・イタリアが属した側|枢軸国|アメリカ・イギリス・中国・ソ連などの連合国と戦いました。
昭和戦後|日本が敗戦を受け入れる際に受諾した宣言|ポツダム宣言|1945年、戦争終結の条件を示しました。
昭和戦後|第二次世界大戦後に日本の指導者の一部を裁いた裁判|極東国際軍事裁判|東京裁判ともいいます。
昭和戦後|日本国憲法のもとで主権を持つ者|国民|天皇は日本国と日本国民統合の象徴です。
現代|地方公共団体の長と議員を住民が直接選ぶ制度|直接請求・直接選挙|地方自治を支える大切な仕組みです。`.trim().split('\n').map(x=>{const [era,text,answer,explain]=x.split('|');return{era,text,answer,explain}});
  const factBank = facts.flatMap(x => {
    const candidates=facts.filter(y=>y.era===x.era&&y.answer!==x.answer).map(y=>y.answer);
    return [{...x,level:3,type:'fill',kind:'一問一答'}, {...x,level:2,type:'choice',kind:'四択・類題',options:shuffle([x.answer,...shuffle(candidates.length>=3?candidates:facts.map(y=>y.answer).filter(a=>a!==x.answer)).slice(0,3)])}];
  });
  // 白地図は「県を答えさせるのに、県の位置が分からない図」にならないよう、
  // 実際の日本列島の向き・島の位置関係に合わせた座標を使う。
  const places = `弥生・古墳|吉野ヶ里遺跡|佐賀県|九州の北西部にある環濠集落の代表|145,300
飛鳥|飛鳥地方|奈良県|近畿地方の内陸部。飛鳥文化・大化の改新の舞台|405,242
奈良|平城京|奈良県|近畿地方の内陸部。奈良時代の都|405,242
平安|平安京|京都府|近畿地方の北寄り。794年に都が置かれた|387,220
鎌倉|鎌倉|神奈川県|関東地方の南西部、東京の南西にある|507,252
室町|京都|京都府|近畿地方の北寄り。室町幕府の所在地|387,220
安土桃山|安土|滋賀県|琵琶湖の東側、近畿地方にある|414,218
江戸前期|江戸|東京都|関東地方の南部、東京湾の西側|520,232
江戸前期|長崎|長崎県|九州の最も西寄りにある貿易港|112,315
江戸後期|蝦夷地|北海道|日本列島の最も北にある大きな島|552,74
幕末・明治|浦賀|神奈川県|三浦半島の東側、東京湾の入口にある|510,258
幕末・明治|函館|北海道|北海道の南西部にある開港場|520,101
幕末・明治|横浜|神奈川県|東京湾の西側にある開港場|507,245
明治・大正|下関|山口県|本州の西の端、九州との間の海峡に面する|260,270
明治・大正|旅順|中国東北部|中国東北部の遼東半島にある日露戦争の激戦地|98,145|asia
昭和戦後|広島|広島県|中国地方の西部、瀬戸内海に面する|300,258
昭和戦後|長崎|長崎県|九州の最も西寄りにある|112,315
現代|沖縄|沖縄県|九州の南西に連なる島々にある|94,388
現代|東京|東京都|関東地方の南部、東京湾の西側|520,232
現代|大阪|大阪府|近畿地方の西部、大阪湾に面する|382,250`.split('\n').map(x=>{const [era,place,answer,explain,pos,scope]=x.split('|');return{era,place,answer,explain,pos,scope}});
  const mapBank=places.flatMap(x=>[{...x,level:2,type:'choice',kind:'白地図',text:'白地図の★が示す場所がある都道府県・地域はどこですか。',options:shuffle([x.answer,...shuffle(places.filter(y=>y.answer!==x.answer).map(y=>y.answer)).slice(0,3)])},{...x,level:3,type:'fill',kind:'白地図・穴埋め',text:'白地図の★が示す場所を、都道府県名または地名で答えなさい。',aliases:[x.place]}]);
  // 小学校～中学受験で頻出の自然地理。白地図専用モードではここから10問出題する。
  const geoPlaces=`山地・山脈|日高山脈|北海道|北海道の中央部を南北にのびる山脈|553,79
山地・山脈|奥羽山脈|東北地方|東北地方を南北に分ける山脈|468,150
山地・山脈|越後山脈|新潟県|新潟県と福島県の県境付近の山脈|430,174
山地・山脈|飛騨山脈|長野県|北アルプスともよばれる山脈|405,190
山地・山脈|木曽山脈|長野県|中央アルプスともよばれる山脈|404,207
山地・山脈|赤石山脈|長野県・静岡県|南アルプスともよばれる山脈|429,212
山地・山脈|中国山地|中国地方|中国地方の中央部を東西にのびる山地|303,233
平野|石狩平野|北海道|北海道西部、石狩川の下流に広がる平野|542,87
平野|仙台平野|宮城県|東北地方の太平洋側に広がる平野|480,168
平野|関東平野|関東地方|日本で最も広い平野|503,222
平野|濃尾平野|愛知県・岐阜県・三重県|木曽川下流に広がる平野|389,218
平野|大阪平野|大阪府|大阪湾の東側に広がる平野|380,250
平野|岡山平野|岡山県|瀬戸内海に面する中国地方の平野|323,251
平野|筑紫平野|福岡県・佐賀県|九州北西部に広がる平野|148,289
川|石狩川|北海道|北海道を流れ、日本で3番目に長い川|548,82
川|北上川|岩手県・宮城県|東北地方の太平洋側を南へ流れる川|472,155
川|利根川|関東地方|関東平野を流れ、太平洋へ注ぐ川|510,226
川|信濃川|長野県・新潟県|日本で最も長い川|421,186
川|木曽川|長野県・岐阜県・愛知県|濃尾平野の西側を流れる川|391,211
川|天竜川|長野県・静岡県|諏訪湖を水源とし、太平洋へ注ぐ川|425,218
川|吉野川|徳島県|四国を東へ流れ、紀伊水道へ注ぐ川|365,294
川|四万十川|高知県|四国南西部を流れる、清流で有名な川|336,298
川|筑後川|福岡県・佐賀県|九州北部を流れる川|146,296
湖・海|琵琶湖|滋賀県|日本で最も大きい湖|411,221
湖・海|霞ヶ浦|茨城県|関東地方にある、日本で2番目に大きい湖|516,220
湖・海|宍道湖|島根県|島根県東部、日本海側にある湖|286,226
湖・海|東京湾|東京都・千葉県・神奈川県|関東地方南部の湾|515,241
湖・海|有明海|福岡県・佐賀県・長崎県・熊本県|九州北西部に広がる干満差の大きい海|140,302
湖・海|瀬戸内海|本州・四国・九州の間|雨が少なく、おだやかな海|325,270`.split('\n').map(x=>{const [category,place,answer,explain,pos]=x.split('|');return{era:'地理',category,place,answer,explain,pos,level:2,type:'choice',kind:'白地図・地理',text:`白地図の★が示す${category}は何ですか。`,mapOnly:true}});
  // 選択肢は必ず同じ分類（川なら川、山脈なら山脈）から作る。
  const geoMapBank=geoPlaces.map(x=>{const peers=geoPlaces.filter(y=>y.category===x.category&&y.place!==x.place);return{...x,options:shuffle([x.place,...shuffle(peers.map(y=>y.place)).slice(0,3)]),answer:x.place,aliases:[x.answer]}});
  const bank=[...base,...direct,...time,...factBank,...mapBank,...geoMapBank];
  let active=[], index=0, score=0, miss=[], setting={level:2,mode:'all',era:null};
  const day=()=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Tokyo'}).format(new Date());
  const getLogs=()=>JSON.parse(localStorage.getItem('jhistory-morning-log')||'{}');
  function record(){const all=getLogs(), d=day(), v=all[d]||{sets:0,correct:0,total:0};v.sets++;v.correct+=score;v.total+=10;all[d]=v;localStorage.setItem('jhistory-morning-log',JSON.stringify(all));}
  function mapSVG(q){if(!q.pos)return '';const markers={
    // map-mobile.svg の縦配置（北海道・沖縄を別枠に置く）に合わせた地点座標。
    '蝦夷地':'33,22','函館':'29,31','江戸':'72,55','東京':'72,55','鎌倉':'70,59','浦賀':'71,60','横浜':'71,58','京都':'56,60','平安京':'56,60','室町':'56,60','安土':'58,59','飛鳥地方':'58,64','平城京':'58,64','大阪':'53,64','広島':'41,68','下関':'32,69','長崎':'17,78','吉野ヶ里遺跡':'22,75','沖縄':'74,82',
    '日高山脈':'40,22','奥羽山脈':'79,37','越後山脈':'68,45','飛騨山脈':'61,52','木曽山脈':'61,57','赤石山脈':'66,57','中国山地':'42,64','石狩平野':'34,25','仙台平野':'78,42','関東平野':'72,54','濃尾平野':'57,60','大阪平野':'53,64','岡山平野':'46,67','筑紫平野':'22,75','石狩川':'35,24','北上川':'80,37','利根川':'74,54','信濃川':'68,45','木曽川':'57,61','天竜川':'65,58','吉野川':'51,71','四万十川':'42,77','筑後川':'22,76','琵琶湖':'58,60','霞ヶ浦':'76,53','宍道湖':'38,63','東京湾':'72,58','有明海':'20,78','瀬戸内海':'46,69'};
    if(q.scope==='asia')return `<div class="map-card"><svg viewBox="0 0 600 260" role="img" aria-label="東アジアの白地図"><path d="M30 30L300 20 360 115 280 235 55 205Z" fill="#edf2f6" stroke="#72889a" stroke-width="3"/><path d="M375 32L455 50 470 184 405 154Z" fill="#edf2f6" stroke="#72889a" stroke-width="3"/><text x="90" y="48" class="map-label">中国東北部</text><text x="382" y="42" class="map-label">朝鮮半島</text><circle class="map-dot" cx="178" cy="117" r="12"/><text x="172" y="123" fill="#fff" font-size="18" font-weight="800">★</text></svg><div class="mini">東アジアの位置関係を見て、★の場所を答えよう</div></div>`;
    const [left,top]=(markers[q.place]||'50,50').split(',');
    return `<div class="map-card"><div class="map-wrap"><img class="map-base" src="https://raw.githubusercontent.com/geolonia/japanese-prefectures/master/map-mobile.svg" alt="都道府県境が入った日本の白地図"><span class="map-pin" style="left:${left}%;top:${top}%" aria-label="問題の地点">★</span></div><div class="mini">都道府県境と列島の形を見て、★の場所を答えよう</div><div class="mini">地図素材: Geolonia Japanese Prefectures（GFDL）</div></div>`}
  function home(){const log=getLogs()[day()];$('home').style.display='block';$('quiz').style.display='none';$('result').style.display='none';$('home').innerHTML=`<div class="daily-card"><span>📖 ${log?`今日は <b>${log.correct} / ${log.total}</b> 問正解（${log.sets}セット）`:'今日の記録はまだありません。最初の10問を始めよう。'}</span><span class="mini">全${bank.length}問以上</span></div><p class="home-intro">朝の5〜10分で、歴史の流れを毎日ひとつずつ強くする演習です。四択だけでなく、漢字で答える穴埋め・年表・白地図を混ぜて出題します。</p><div class="setting-title">難易度を選ぶ</div><div class="difficulty"><button class="level ${setting.level===1?'selected':''}" data-level="1">基本</button><button class="level ${setting.level===2?'selected':''}" data-level="2">標準・受験</button><button class="level ${setting.level===3?'selected':''}" data-level="3">難関・記述多め</button></div><div class="modes" style="margin-top:22px"><button class="mode" id="newAll"><strong>朝の総合ランダム 10問</strong><span>全時代・全形式から、その日の10問。</span></button><button class="mode" id="newMap"><strong>白地図・地理だけ 10問</strong><span>山地・山脈、平野、川、湖・海を集中演習。</span></button><button class="mode" id="newEra"><strong>時代別・重要問題 10問</strong><span>時代を選び、頻出テーマを集中演習。</span></button></div><div class="era-select" id="newEraSelect" hidden><h2>出題する時代を選択</h2><div class="era-buttons" id="newEraButtons"></div></div>`;document.querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>{setting.level=+b.dataset.level;home()});$('newAll').onclick=()=>start('all');$('newMap').onclick=()=>start('map');$('newEra').onclick=()=>{$('newEraSelect').hidden=!$('newEraSelect').hidden};Object.keys(groups).forEach(e=>{const b=document.createElement('button');b.className='era';b.textContent=e;b.onclick=()=>start('era',e);$('newEraButtons').append(b)});}
  function start(mode,era=null){setting.mode=mode;setting.era=era;let pool=mode==='map'?geoMapBank:bank.filter(q=>q.level<=setting.level&&(mode==='all'||groups[era].includes(q.era)));if(pool.length<10)pool=mode==='map'?geoMapBank:bank.filter(q=>mode==='all'||groups[era].includes(q.era));active=shuffle(pool).slice(0,10);index=0;score=0;miss=[];$('home').style.display='none';$('result').style.display='none';$('quiz').style.display='block';$('modeLabel').textContent=mode==='all'?`総合・${['基本','受験','難関'][setting.level-1]}`:mode==='map'?'白地図・地理':era;render();}
  function render(){const q=active[index];$('counter').textContent=`第 ${index+1} 問 / 10`;$('bar').style.width=`${index*10}%`;$('qEra').innerHTML=`${q.era}<span class="question-kind">${q.kind}</span>`;$('qText').textContent=q.text;$('feedback').className='feedback';$('next').className='next';$('choices').innerHTML=mapSVG(q);if(q.type==='choice'){const box=document.createElement('div');box.className='choices';shuffle(q.options).forEach(a=>{const b=document.createElement('button');b.className='choice';b.textContent=a;b.onclick=()=>judge(a,b);box.append(b)});$('choices').append(box)}else{$('choices').insertAdjacentHTML('beforeend','<div class="answer-box"><input id="answerInput" class="answer-input" placeholder="答えを入力"><button id="submitAnswer" class="submit-answer">答える</button></div>');const input=$('answerInput');$('submitAnswer').onclick=()=>judge(input.value);setTimeout(()=>input.focus(),40)}}
  function judge(value,button){if($('next').classList.contains('show'))return;const q=active[index],ok=answerMatches(value,q);if(q.type==='choice'){document.querySelectorAll('.choice').forEach(b=>{b.disabled=true;if(clean(b.textContent)===clean(q.answer))b.classList.add('correct')});if(!ok)button.classList.add('wrong')}else{$('answerInput').disabled=true;$('submitAnswer').disabled=true;$('answerInput').style.borderColor=ok?'#247b61':'#b9464c'}if(ok)score++;else miss.push(q);$('feedback').innerHTML=ok?`<b>正解！</b>${q.explain}`:`<b>おしい！ 正解は「${q.answer}」</b>${q.explain}`;$('feedback').classList.add('show');$('next').textContent=index===9?'今日の結果を見る':'次の問題へ';$('next').classList.add('show')}
  $('next').onclick=()=>{index++;index<10?render():result()};
  function result(){record();$('quiz').style.display='none';$('result').style.display='block';$('score').textContent=`${score} / 10`;$('resultText').textContent=score>=8?'朝からいい集中です。明日も10問、続けて積み上げよう。':score>=5?'解説を一読して終了でOK。明日の10問で再会しましょう。':'今日は間違いを2〜3個だけ覚えて終わりにしよう。続けるほど伸びます。';let review=$('review');if(!review){review=document.createElement('div');review.id='review';$('result').append(review)}review.className='review '+(miss.length?'show':'');review.innerHTML=miss.length?`<h3>今日の復習（最大4問）</h3><ul>${miss.slice(0,4).map(q=>`<li><b>${q.answer}</b> — ${q.explain}</li>`).join('')}</ul>`:'';}
  $('retry').onclick=()=>start(setting.mode,setting.era);$('back').onclick=home;home();
})();
