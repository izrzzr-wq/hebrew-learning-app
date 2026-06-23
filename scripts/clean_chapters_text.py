import re
import json

filepath = "/Users/jinholee/.gemini/antigravity/scratch/hebrew-learning-app/data/chapters_text.js"

# Read the file
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Locate the JSON block
prefix = "const CHAPTERS_TEXT = "
suffix = ";\n\nif (typeof module !== 'undefined' && module.exports) {\n  module.exports = CHAPTERS_TEXT;\n} else {\n  window.CHAPTERS_TEXT = CHAPTERS_TEXT;\n}"

json_start = content.find(prefix)
json_end = content.find(";\n\nif (typeof", json_start)

if json_start == -1 or json_end == -1:
    print("Error: Could not locate JSON structure in chapters_text.js")
    exit(1)

json_str = content[json_start + len(prefix):json_end].strip()
try:
    chapters_data = json.loads(json_str)
except Exception as e:
    print(f"Error parsing JSON: {e}")
    exit(1)

# Large-block replacements for severely corrupted OCR sections (e.g. diagrams/tables)
large_block_replacements = [
    # Ch2: Ancient Hebrew Alphabet Chart (severely corrupted ancient letter diagram)
    (
        "Anclent Hebr.\u201c Alphabet Chart \nAnc\u2018nt \n}\u2018obr.\u2019\u2018 \nPlc\u2018ur'\u2018... Pictur. oe\u2018C\u2743ption \u2019\u2018Ant\uff0c. of Lett.\uff0c \n\ufffdt\u2018.r \n\uff0c-\u201c\u2018 \uff0c * @\u2026 \u2026 \ub0b4\u7e3d \ube7c\ucc0c \u2026 * * * \ube7c \ube7c \ube7c \ube68 \ube7c \u201d \ube7c \ube7c \ube6c-\u2018M \ucc44\u03b9x k \ube7c\u5c0a \n\u2019 ty 0.\uff0c\uff0c\uff0c\uff0c0<1 \u201c\u2019@\uae68. pO:woe.\uff0c tea*r A \nt!I tent noor-plan famitv. house. in \n\u2018 \u201900< \uff0cathe\u03ba w\u2018\u2018\u2018\uff0c carr y \n'.m doof \"\"\"\"' \"\u3001\uff0c\u3001t\uff0c hant \uff0c en ler 0 \n4ft mdn with arm.s nIIlsed br\ufffdalh\uff0c look\uff0c rrYe.!\u201c \nY \u2018.ent peoti \nmattock (\uc774\uc544\uc608h l \nID ten l wall \no \uc5b4ske\u2018.dd \u2018eclle. hoot U \nlood\u2018 c\u201c-\u2019oe\ufffdpon\uff0cnour\uc368\u3001 z \n0<Jt\u2018''''' \uff0c \uc5d0\\Ii<k-\uff0c ha\u2018\u2019 \uc5d0 \nSUTOI.Jnd\uff0c conuin\uff0c ml\ud53c 6\u2019 \n10 \uff0c.... h.and and arm \u2019\u2018ri<\uff0c \u2018Iv\u3002\u2018\u2018 \u2018iIOf'\"5hip \n11 \\!9 \ufffd\u3001 patm o( Mnd be-nd\u2018 \uc774>e\u2019\u2018\uff0c allow\uff0c lame \n\u2019 J \"'\"\uc774.. \".\u201claft le ach. yok.eo\uff0c lowaJd. bind L \n1] \u201c \u2018a\u2018.\" chao\u201c mi\ud618ty. bI\uc544>d M \ncontlnue. \u2019\u2018e\u2018r\uff0c ton N \nIrab. naloe\uff0c pnxect \nwatch\uff0c know. \uc57d\uff0c.do o \n\ubc84\u201c\u3002 sca\u201c.er \uff0c edfe P \n1\u2018 \u3001 s\u03b1\"ou\u2018 '\" 1 seed \n15 \u201c110m \n\u2019\u2018 \u3008\ub9ac..,\u2026 \n17 \u3002\uc57cn mouth \n\" \u3002\u201c do\u201c\u2018naUon and p.iI\ufffdh \u2018ralt. joume\u2018 h\u03b9\u201c \n19 \u2018..\uff0c at th(o hof'tzon conde1lse. clrcle. \u2018\u2019m\ufffd Q \n20 \ufffd \u2018\"\". d 1.. \u201c \uff0c lop. besinn\u2019\"1 \n\u3002\n\" [.h) K \n8 \uadf8 \nG \no \u300c\nE (eh ) \u3014\nU [od\u2018l \nz \nCH\" n \nTH \u3002\n\uff0c (\"\" h) \n\uff0c\uff0c:;\uff0c \n\uc789 \nM C\uff0c\u3002\nN l \uff0c l \nx \u3002\nO[ \uc5b4\uff0c) p \n\ud788\uff0c!) \nTS \u03b3\uff0c l; \nQ\u2019 P \n\u300c\n\u3002\n\u2018Jb' \u03b9 a| : ::\u2019 \u2018 - \nft!I 8aT bot \n\u201c G.\u03bc \ub9f9m :;\u201d\u201d \uff0c. \n\ub2c8\"'\u00d8\" DaL daJ \uc591 \u201d\u2019 \nb-\"t E\u00c0 etH1h :':: \uff0c\ucc0c\ufffd\uff0c to-.w \nyy Uu \uc5981-0011\uc5ed\uc5bb \u3010\n\u3001-z-N an t1S; \u201c\u201d \u2019\u2018 \u2018ZD HaS Cha1S \uc559?\u2019\u2018 -\uff0c-.. Oa\u00f3 \ubaa86\u3001 :\uc5bc ____ I'.l........ I\u3002 eed \ufffd \ufffd.. -..... \n\u2019\u201d\u2019 \u2018\uff0c.\" \u2022\u2022 \"\u3010\".\uff0c\u2019\uff0c.\u201d \"\uff0c\uff0c(Pt\uff0cl1.I.\"\u3002\ube7c m m \u2026\u2026 \ub54c \u2026\u201d \ube7c J\u201c L& \u03b9\uff0c\"\u2019\uff0c -. \u2019\u2018... \u2018 \n\u3001\u3001 NaN nan _\uff0c.. __ \n\u3001\u2018 X\u00f0N xan \n\u3001<\uc5de ON on =\uff0c\u2018:\u2026 \u2019\u2018\u201d \nb-'- PA P\u00f0h ::.;..... \u2019 \u2018\u2019 'Q'\"0<...0\\ s.aO tsad ::...:::! \u2018 \u2019\u201d \n-..... Qa\uff0cP q\u03b2p\nu\uff0c('I\"' J rash",
        "\n*(이곳은 고대 문자 변천사 도표가 있던 자리입니다. 이미지 손상으로 인하여 생략하며, 히브리어 알파벳의 형태는 앱의 학습 파트를 참고해 주세요.)*\n"
    ),

    # Ch3: Dotted circles/vowel diagram corrupted block (Page 3/4 area in ch3)
    (
        "(자음장 모음)  \u25cc \u25cc \u25cc  75  ### Page 3  \u2019\u25cc \u201d\u25cc....  \uc5b4|  \u25cc \u25cc \u25cc.......  \u3014\u25cc \u3014\u25cc........  01 \u25cc \u2019\u25cc..  \uc624 \u25cc \u25cc \u25cc 1\u25cc \u3014\u25cc T T:  o  \u25cc 1\u25cc \u00ef\"\"..  \uc631 ly\u3014o \u03c4l\ufffd\uad90 \ub20c\uac1b\ubab9\ufffd!?-l\u03b9\uac1f \u05d0d\ud638\ub97c\ub18dt?\ub20clo \ufffd1fl\ufffd\uc53b E{\uadfcL \uacf5\uc751{\ufffd \uacfcI\uac19 {E\n\ub984\ubb49d t\u00f5\ufffdl\u3014L lo.\u03c4l\ufffd{\ufffd \ub20c\uacf5\ud54d{\u03b9 \ub97c\ub18dt?\u201d\u201d t\u00f5\u201c4\uaebc -h\u201c-r \uadf9llo\u05d0tl\u3002 \ubb3cr",
        "\n*(이곳은 자음과 모음의 결합 원리를 보여주는 모음 도표 기호들이 있던 자리입니다. 상세한 히브리어 모음 체계와 결합 원리는 앱 내의 '문법 요약표'를 참고하시기 바랍니다.)*\n"
    ),

    # Ch3: Long corrupted section at the end of ch3
    (
        "(\u05df)C)\ub18d : N\ufffd (\u05df)S)\ufffd : Q\ufffd\n(\u05df)c)\u00f5 : N \ufffd (9S)\ucd94 : Q\ufffd..\n(d\ufffd\uc598NN j (g\uc598..\n(\ufffdS) l\ufffdY : Q......\n(\ufffdSH\ufffdY : Q...\n(o{\u03b9\ub8f5 H\uc624 \ubdcd \uc6d4 \ufffdr \ufffd\u03c4fl\ufffdt:s: \ub3d5\ubc1f{ft \uad7dS I\u00f2l\u03b9\ud45c F\u03b4\ubb49 t\u00f5\u3002 \ub984m\n\uc751 \ud798 \uad05 l\u3002\uacf1{\ub7bfo \u201c\u201d llo\u00deL \uad90l \u03b9\ud45c \uad7dl-o\ufffd-\uad09l\uc624.\ud765\ud315\ufffd!?-\u2018 l\u03b9\uac1f \ub989\ub97c\ubb49E\uc6a9\uaf45 l\u3002\nEl\ufffd{\u03b9 \ub989(\uad4e\ub959) \uc568 io(E\ufffd\ubc30Y) Q kllolt;!{o \ufffd\u03bacl\u3002\ud15cmr \ufffd\uac15l\ufffdm \uc6b4 \ub871\ub9d5{\u3002 \ub0a8\n(\u05df)W) \uad6c : \ufffd\ufffd (9W) \u00f3 :\n\ufffd\ufffd.1fk\ufffd l\u00df \uc62c \uacf5\ucd55l*lw \ud48d?\u201c\u201d L-lY lY \u30140 llon.po \uacf5\u300f \uc751 \u4e03b i\ud6c4l\u03b9\ud45c l\u3002\uce84 \uac1fF\u03b4",
        "\n*(이곳은 히브리어 모음 결합에 따른 음가 변화를 표시하는 도표 자리입니다. 자음과 모음의 상세 결합 원리는 앱 내 '문법 요약표'에 정리되어 있습니다.)*\n"
    ),

    # Ch6: Verb Paradigm (severely corrupted table)
    (
        "(\ufffdYFo)\ub97c \u03b6k (\ufffdy\u00fe )\uac15t \ufffd\n\ub2c8l /\ub2c8E\ub2c8. 1:0\n\ub2c8\u2018\u3009\u2018 (\ubc14\ub2c8l)\uc554\ufffdy:\n\ub2c8\ub514/\ub2c8\ufffd \ub2c8 \ub2c8\ufffd\ufffd (\ubc14\ub0b4)\ufffd\ufffdy:\n(\ufffdy\u00fe )\ud6c8l \u3002\n\u2022 \ufffdY\uc6c0HlI YIY.\n(\u00c1d\ub300) ({\ufffdFo )\ub984r (dl{\uc2a4) \ud2f0r\n\ub2c8l /\ub2c8 E\ub2c8. \ub2c8\ufffd \ufffd\n(\u00c1d\ub300) ({\ufffd\ubaa4)\ub989r (dl{)r.. 4\n\ub2c8\uba70/ \ub2c8\uad49 \ub2c8 \ub2c8\ufffd \ufffd",
        "\n*(이곳은 히브리어 동사 인칭 변화 패러다임 표가 있던 자리입니다. 상세 동사 변화표는 앱의 '문법 요약표'를 참고하시기 바랍니다.)*\n"
    ),
]

# Definition of spelling and symbol corrections (using \ufffd for unicode placeholders)
replacements = [
    # 1. Main Hebrew alphabet OCR restorations (mapping U+FFFD or garbled English/Korean to Hebrew chars)
    ("알레프(외.eph， \ufffd)", "알레프(Aleph, א)"),
    ("알레프(외.eph, \ufffd)", "알레프(Aleph, א)"),
    ("알레프(꾀eph， \ufffd)", "알레프(Aleph, א)"),
    ("알레프(꾀eph, \ufffd)", "알레프(Aleph, א)"),
    ("알레프(\ufffd)", "알레프(א)"),
    ("알레프은", "알레프는"),
    ("알레프을", "알레프를"),
    ("베트(b.et定位， \ufffd)", "베트(Bet, ב)"),
    ("베트(b.et， \ufffd)", "베트(Bet, ב)"),
    ("베트(b.et, \ufffd)", "베트(Bet, ב)"),
    ("베트 (bet)라고", "베트(Bet, ב)라고"),
    ("김멜 (맹runel, J)", "기멜(Gimel, ג)"),
    ("김멜 (맹runel， J)", "기멜(Gimel, ג)"),
    ("달레트(dalet, i)", "달레트(Dalet, ד)"),
    ("달레트(dalet， i)", "달레트(Dalet, ד)"),
    ("헤(he, ;,)", "헤(He, ה)"),
    ("헤(he， ;,)", "헤(He, ה)"),
    ("헤(he, \ufffd)", "헤(He, ה)"),
    ("헤(he， \ufffd)", "헤(He, ה)"),
    ("자인 (zain, ì)", "자인(Zayin, ז)"),
    ("자인 (zain， ì)", "자인(Zayin, ז)"),
    ("자인(Zayin, \ufffd)", "자인(Zayin, ז)"),
    ("헤트 (het, n)", "헤트(Het, ח)"),
    ("헤트 (het， n)", "헤트(Het, ח)"),
    ("헤트(Het, \ufffd)", "헤트(Het, ח)"),
    ("테트(tet, 매)", "테트(Tet, ט)"),
    ("테트(tet， 매)", "테트(Tet, ט)"),
    ("요드(yod, ’)", "요드(Yod, י)"),
    ("요드(yod， ’)", "요드(Yod, י)"),
    ("요드(yod, \ufffd)", "요드(Yod, י)"),
    ("카프(없ph, \ufffd)", "카프(Kaf, כ)"),
    ("카프(없ph， \ufffd)", "카프(Kaf, כ)"),
    ("라메드(1때ed, 딩)", "라메드(Lamed, ל)"),
    ("라메드(1때ed， 딩)", "라메드(Lamed, ל)"),
    ("멤(mem, \ufffd)", "멤(Mem, מ)"),
    ("멤(mem， \ufffd)", "멤(Mem, מ)"),
    ("눈(nun, J)", "눈(Nun, נ)"),
    ("눈(nun， J)", "눈(Nun, נ)"),
    ("사메크(sameq, 0)", "사메크(Samekh, ס)"),
    ("사메크(sameq， 0)", "사메크(Samekh, ס)"),
    ("사메크(Samekh, \ufffd)", "사메크(Samekh, ס)"),
    ("아인 (ain, \ufffd)", "아인(Ayin, ע)"),
    ("아인 (ain， \ufffd)", "아인(Ayin, ע)"),
    ("페( pe, tl)", "페(Pe, פ)"),
    ("페( pe， tl)", "페(Pe, פ)"),
    ("짜데 (sade. \ufffd)", "차데(Tsade, צ)"),
    ("짜데 (sade. ， \ufffd)", "차데(Tsade, צ)"),
    ("차데(Tsade, \ufffd)", "차데(Tsade, צ)"),
    ("코프(q\u03c6h, P)", "코프(Qof, ק)"),
    ("코프(q\u03c6h， P)", "코프(Qof, ק)"),
    ("코프(qoph, p)", "코프(Qof, ק)"),
    ("레쉬 (resh,1)", "레쉬(Resh, ר)"),
    ("레쉬 (resh\uff0c1)", "레쉬(Resh, ר)"),
    ("씬(sin, 띠)", "신(Sin, ש\u05c2)"),
    ("쉰(sinh, 띠)", "신(Shin, ש\u05c1)"),
    ("타브(taw, rl)", "타브(Tav, ת)"),
    ("타브(taw\uff0c rl)", "타브(Tav, ת)"),

    # Direct char-to-char translations for common OCR corruptions
    ("\ufffd = )", "א = ’"),
    ("\ufffd+口 =)", "א + \u05b8 = ’"),
    ("\ufffd+口+\ufffd", "א + \u05b8 + א"),
    ("종성의 \ufffd", "종성의 א"),
    ("초성의 \ufffd", "초성의 א"),
    ("자음인 \ufffd", "자음인 א"),
    ("초성 \ufffd", "초성 א"),
    ("종성 \ufffd", "종성 א"),
    ("종성 의 \ufffd", "종성의 א"),
    ("초성 의 \ufffd", "초성의 א"),
    ("알레프 \ufffd", "알레프 א"),
    ("알레프 \ufffd은", "알레프 א는"),
    ("베트(\ufffd)", "베트(ב)"),
    ("헤(\ufffd)", "헤(ה)"),
    ("자인(\ufffd)", "자인(ז)"),
    ("헤트(\ufffd)", "헤트(ח)"),
    ("아인(\ufffd)", "아인(ע)"),
    ("아인 \ufffd은", "아인 ע는"),
    ("차데(\ufffd)", "차데(צ)"),
    ("신(Sin, \ufffd)", "신(Sin, ש\u05c2)"),
    ("신(Shin, \ufffd)", "신(Shin, ש\u05c1)"),
    ("타브(\ufffd)", "타브(ת)"),

    # 2. Glitch character '口' (U+53E3) which should be placeholder dotted circle (◌) or vowel marks
    ("口 = a( r )", "\u05b8 = a(ㅏ)"),
    ("口 = a( } )", "\u05b8 = a(ㅏ)"),
    ("口 = aC } )", "\u05b8 = a(ㅏ)"),
    ("쉐봐 口 (네모 칸", "쉐봐 \u25cc (네모 칸"),
    ("쉐봐 + a소리 口 + 口 응 口", "쉐봐 + a소리 \u25cc + \u05b8 \u2192 \u25cc\u05b8"),
    ("쉐봐 + e소리 口 + 口 \u2192 口", "쉐봐 + e소리 \u25cc + \u05b5 \u2192 \u25cc\u05b5"),
    ("쉐봐 + 0소리 口 + 口 응 口", "쉐봐 + o소리 \u25cc + \u05b9 \u2192 \u25cc\u05b9"),
    ("口 (짧은 \u201c 1- ", "\u25cc\u05b7 (짧은 \u201cㅏ\u201d"),
    ("아  口 장모음  口 T  단모음  口-", "\uc544 \u25cc \uc7a5\ubaa8\uc74c \u25cc\u05b8 \ub2e8\ubaa8\uc74c \u25cc\u05b7"),
    ("아  口 장모음  口 T", "\uc544 \u25cc \uc7a5\ubaa8\uc74c \u25cc\u05b8"),
    ("단모음  口-", "\ub2e8\ubaa8\uc74c \u25cc\u05b7"),
    ("(자음장 모음)  口 \u3014口 X口-. T T.", "(자음장 모음) \u25cc \u25cc \u25cc"),
    ("\u2019口 \u201d口.... \uc5b4|  口 口 口....... \u3014口 \u3014口", "\u25cc \u25cc \u25cc \u25cc"),
    ("口 \u3014口 X口-. T T.", "\u25cc \u25cc \u25cc"),
    ("네모 칸은 그냥 7냉의 어떤 뽑 나타냄", "네모 칸은 그냥 자음의 어떤 위치를 나타냄"),
    ("7냉의 어떤", "자음의 어떤"),
    ("어떤 뽑 나타냄", "어떤 위치를 나타냄"),
    ("口", "\u25cc"), # 일괄 변환 규칙

    # 3. Typos, spelling errors & Han-Geul OCR flaws
    ("알따뱃", "알파벳"),
    ("일페뱃", "알파벳"),
    ("일표}벗!", "알파벳!"),
    ("효달", "한글"),
    ("효택어", "한국어"),
    ("효단뻐", "한국어"),
    ("조흡}", "조합"),
    ("조합}해야", "조합해야"),
    ("바19", "king"),
    ("따19", "king"),
    ("없ng", "king"),
    ("끄ng", "king"),
    ("keng\uff0ckung\uff0c없ng\uff0ckong\uc2dd\uc5bc\ub85c", "keng, kung, king, kong 식으로"),
    ("keng\uff0c kung\uff0c 없ng\uff0c kong식으로", "keng, kung, king, kong 식으로"),
    ("끄은 \ufffd과 달리", "아인(ע)은 알레프(א)와 달리"),
    ("8 과의", "알레프와의"),
    ("R 의", "알레프의"),
    ("R 이", "알레프가"),
    ("K 이", "알레프가"),
    ("끄은", "아인은"),
    ("끄의", "아인의"),
    ("끄이", "아인이"),
    ("끄", "\u05e2"),
    ("R", "\u05d0"),
    ("K", "\u05d0"),
    ("1L|\u2019", "\u2019"),
    ("소릿 값", "소릿값"),
    ("한글의 \u201c\uc2b9\u201d \uc815\ub3c4\ub85c", "한글의 \u201c\ud765\u201d \uc815\ub3c4\ub85c"),
    ("한글의 \u201cE\u201d \uc815\ub3c4", "한글의 \u201c\u3137\u201d \uc815\ub3c4"),
    ("강한 \u201c\uc2b9\u201d \uc18c\ub9ac", "강한 \u201c\ud765\u201d \uc18c\ub9ac"),
    ("\uc559\u201d\ucc18 \ub7ec\ubbf8", "\uc559\u201d\ucc98\ub7fc"),
    ("\uc559\u201d\ucc18", "\uc559\u201d\ucc98\ub7fc"),
    ("\uc30d\uac15 \uc18c\ub9ac (\ud574) \uc815\ub3c4", "\uc30d\ud765 \uc18c\ub9ac(\ud765\ud765) \uc815\ub3c4"),
    ("타브(taw\uff0c \uaebc)", "타브(Tav, \u05ea)"),
    ("한글로는 \u201c \ub2d8 \u201d \uc815\ub3c4", "한글로는 \u201c \u3142 \u201d \uc815\ub3c4"),
    ("\u201c1:l \uc785\ub2c8\ub2e4", "\u201c\u3142\u201d\uc785\ub2c8\ub2e4"),
    ("\u201c --\uff0c L C 2... \"", "\u201c\u3131, \u3134, \u3137, \u3139...\""),
    ("\u201c } ]: 1 ... \"", "\u201c\u314f, \u3151, \u3153, \u3155...\""),
    ("\u201c-.\u00a0\uc774", "\u201c\u3131\u201d\uc774"),
    ("\u201c2\" \uc774 \ucd08\uc131", "\u201c\u3139\u201d\uc774 \ucd08\uc131"),
    ("\u201c\"\\\"T \uac00 \ucd08\uc131", "\u201c\u315c\u201d\uac00 \uc915\uc131"),
    ("\u201c\"\\\"T \uac00 \uc915\uc131", "\u201c\u315c\u201d\uac00 \uc915\uc131"),
    ("\u201c L \u201d\uc774 \uc885\uc131", "\u201c\u3134\u201d\uc774 \uc885\uc131"),
    ("H \uc21c\uacbd\uc74c", "\u3181 \uc21c\uacbd\uc74c"),
    ("\ubc29\uc21c\uacbd\uc74c", "\u3181 \uc21c\uacbd\uc74c"),
    ("\ub2d8 \uc21c\uacbd\uc74c", "\u3181 \uc21c\uacbd\uc74c"),
    ("\ucd94\ubdd4", "\ucd94\uc6cc"),
    ("\ucd94 \ube59 1", "\ucd94\ubc84"),
    ("\u201c : \uc73c\ub85c", "\u201c\u3148\u201d\uc73c\ub85c"),
    ("\u201c \ub2d8 \u201d \uc815\ub3c4", "\u201c\u3142\u201d \uc815\ub3c4"),
    ("지랑이", "지렁이"),
    ("목지 이응", "꼭지 이응"),
    ("목지이응", "꼭지이응"),
    ("중E뻐|", "중에"),
    ("돗을", "뜻을"),
    ("못판", "못한"),
    ("히닙리어", "히브리어"),
    ("히님리어", "히브리어"),
    ("동}는", "하는"),
    ("김멜", "기멜"),
    ("짜데", "차데"),
    ("봐브", "바브"),
    ("여닮 번째", "여덟 번째"),
    ("겉았다", "같았다"),
    ("이주 싫어했다", "아주 싫어했다"),
    ("이주싫어했다", "아주 싫어했다"),
    ("극복딴", "극복한"),
    ("차근치근", "차근차근"),
    ("어 렵다고", "어렵다고"),
    ("명At", "명사"),
    ("명人H", "명사"),
    ("명人", "명사"),
    ("골치거리", "골칫거리"),
    ("유전지들이", "유전자들이"),
    ("골치거리 는", "골칫거리는"),
    ("골칫거리 는", "골칫거리는"),
    ("남알", "니팔"),
    ("힐파 엘", "히트파엘"),
    ("힘일", "히필"),
    ("훌알", "호팔"),
    ("카탈껴하al)", "카탈(Qatal)"),
    ("카탈껴하", "카탈(Qatal)"),

    # Begadkephat detailed corrections
    ("베게드 케페트(자음에 주목 8\uff0c\u200b\u4ea1 \ud050 \ud45cE )", "베게드 케페트(자음에 주목 \u05d1, \u05d2, \u05d3, \u05db, \u05e4, \u05ea)"),
    ("그 \ufffd \uff0c \ufffd 틀 h\uc758 \uc5ec\uc12b \uac1c \uae00\uc790", "그 \u05d1, \u05d2, \u05d3, \u05db, \u05e4, \u05ea\uc758 \uc5ec\uc12b \uac1c \uae00\uc790"),

    # Spelling errors for ch1 korean alphabet placeholders
    ("모음: \u201c \ufffd\uff0c F\uff0c 1\uff0c \ufffd\"", "모음: \u201c\u314f, \u3151, \u3153, \u3155\u201d"),

    # Common typos in layout
    ("Teach Yo\u03bcseif To Read Hebre\u03bc", "Teach Yourself To Read Hebrew"),
    ("EKS Pub\u00ad\nlishing", "EKS Publishing"),
    ("EKS Pub\u00adlishing", "EKS Publishing"),
]

# Spacing correction mappings (using Regex)
spacing_patterns = [
    # Clean up spaces inside core words
    (r'히\s*브\s*리\s*어', '히브리어'),
    (r'알\s*파\s*벳', '알파벳'),
    (r'알\s*파\s*뱃', '알파벳'),
    (r'이\s*야\s*기', '이야기'),
    (r'기\s*부\s*터', '기부터'),
    (r'임\s*시\s*방\s*편', '임시방편'),
    (r'임시방편\s*적인', '임시방편적인'),
    (r'임시방편\s*적', '임시방편적'),
    (r'소\s*릿\s*값', '소릿값'),
    (r'소\s*리\s*값', '소릿값'),
    (r'꼭\s*지\s*이\s*응', '꼭지 이응'),
    (r'학\s*술\s*적', '학술적'),
    (r'학\s*습\s*효\s*과', '학습 효과'),
    (r'유\s*전\s*자', '유전자'),
    (r'유\s*전\s*자\s+정\s*보', '유전자 정보'),
    (r'한\s*국\s*어', '한국어'),
    (r'영\s*어\s*의', '영어의'),
    (r'한\s*글\s*의', '한글의'),
    (r'자\s*음\s*과', '자음과'),
    (r'모\s*음\s*과', '모음과'),
    (r'모\s*음\s*이', '모음이'),
    (r'자\s*음\s*이', '자음이'),
    (r'결\s*합\s*해', '결합해'),
    (r'결\s*합\s*되\s*어', '결합되어'),
    (r'설\s*명\s*해', '설명해'),
    (r'배\s*우\s*기', '배우기'),
    (r'배\s*우\s*기\s*가', '배우기가'),
    (r'배\s*우\s*기\s*는', '배우기는'),
    (r'쉬\s*워\s*집\s*니\s*다', '쉬워집니다'),
    (r'어\s*려\s*워\s*합\s*니\s*다', '어려워합니다'),
    (r'친\s*해\s*지\s*는', '친해지는'),
    (r'생\s*소\s*합\s*니\s*다', '생소합니다'),
    (r'유\s*사\s*합\s*니\s*다', '유사합니다'),
    (r'동\s*일\s*합\s*니\s*다', '동일합니다'),
    (r'비\s*슷\s*합\s*니\s*다', '비슷합니다'),
    (r'동\s*일\s*시', '동일시'),
    (r'자\s*동\s*으\s*로', '자동으로'),
    (r'해\s*결\s*됩\s*니\s*다', '해결됩니다'),
    (r'해\s*결\s*된\s*다\s*는', '해결된다는'),
    (r'이\s*해\s*만', '이해만'),
    (r'이\s*해\s*하\s*셔\s*야', '이해하셔야'),
    (r'이\s*해\s*하\s*고', '이해하고'),
    (r'이\s*해\s*하\s*지', '이해하지'),
    (r'지\s*름\s*길', '지름길'),
    (r'지\s*름\s*길\s*을', '지름길을'),
    (r'독\s*일\s*어', '독일어'),
    (r'프\s*랑\s*스\s*어', '프랑스어'),
    (r'라\s*틴\s*어', '라틴어'),
    (r'그\s*리\s*스\s*어', '그리스어'),
    (r'헬\s*라\s*어', '헬라어'),
    (r'영\s*어\s*권', '영어권'),
    (r'한\s*국\s*인\s*에\s*게\s*는', '한국인에게는'),
    (r'큰\s*이\s*점', '큰 이점'),
    (r'이\s*점\s*입\s*니\s*다', '이점입니다'),
    (r'조\s*합\s*해\s*서', '조합해서'),
    (r'조\s*합\s*하\s*여', '조합하여'),
    (r'조\s*합\s*해\s*야', '조합해야'),
    (r'거\s*의\s+항\s*상', '거의 항상'),
    (r'같\s*은\s+소\s*리', '같은 소리'),
    (r'뜻\s*을', '뜻을'),
    (r'단\s*어\s*를', '단어를'),
    (r'글\s*자\s*만', '글자만'),
    (r'글\s*자\s*만\s*으\s*로\s*도', '글자만으로도'),
    (r'습\s*득\s*하\s*는\s*것', '습득하는 것'),
    (r'별\s*개\s*로', '별개로'),
    (r'매\s+단\s*어', '매 단어'),
    (r'알\s*아\s*야\s*야\s*합\s*니\s*다', '알아야만 합니다'),
    (r'알\s*아\s*야\s*합\s*니\s*다', '알아야 합니다'),
    (r'읽\s*지\s*만', '읽지만'),
    (r'읽\s*지\s*않\s*습\s*니\s*다', '읽지 않습니다'),
    (r'배\s*울\s+때', '배울 때'),
    (r'가\s*르\s*칠\s+때', '가르칠 때'),
    (r'부\s*밎\s*치\s*는', '부딪치는'),
    (r'부\s*딪\s*치\s*는', '부딪치는'),
    (r'골\s*치\s*거\s*리', '골칫거리'),
    (r'골\s*칫\s*거\s*리', '골칫거리'),
    (r'단\s*어\s+끝', '단어 끝'),
    (r'중\s+에', '중에'),
    (r'점\s+을', '점을'),
    (r'찍\s*어\s*야', '찍어야'),
    (r'특\s*수\s*한', '특수한'),
    (r'설\s*명\s*할\s+것', '설명할 것'),
    (r'설\s*명\s*할\s*것\s*임', '설명할 것임'),
    (r'설\s*명\s*할\s*것\s*입\s*니\s*다', '설명할 것입니다'),
    (r'극\s*복\s*하\s*고', '극복하고'),
    (r'정\s*확\s*하\s*게', '정확하게'),
    (r'소\s*리\s+내\s*어', '소리 내어'),
    (r'소\s*리\s*내\s*어', '소리 내어'),
    (r'소\s*리\s+낼', '소리 낼'),
    (r'소\s*리\s*낼', '소리 낼'),
    (r'소\s*리\s+낼\s*수', '소리 낼 수'),
    (r'소\s*리\s*낼\s*수', '소리 낼 수'),
    (r'쓸\s+수\s+있\s*게', '쓸 수 있게'),
    (r'쓸\s*수\s*있\s*게', '쓸 수 있게'),
    (r'되\s*는\s*것\s*입\s*니\s*다', '되는 것입니다'),
    (r'멋\s*진\s+일', '멋진 일'),
    (r'놀\s*라\s*운\s+점', '놀라운 점'),
    (r'단\s*계\s*까\s*지\s*만', '단계까지만'),
    (r'단\s*계\s*까\s*지', '단계까지'),
    (r'마\s*구\s+난\s*무\s*하\s*는', '마구 난무하는'),
    (r'상\s*당\s*수의', '상당수의'),
    (r'주\s*석\s*들\s*이', '주석들이'),
    (r'마\s*음\s+편\s*하\s*게', '마음 편하게'),
    (r'목\s*사\s*님\s*들\s*은', '목사님들은'),
    (r'심\s*적\s*으\s*로', '심적으로'),
    (r'위\s*축\s*되\s*고', '위축되고'),
    (r'머\s*리\s*에', '머리에'),
    (r'들어\s+오\s*지\s*도', '들어오지도'),
    (r'울\s*렁\s*증\s*은', '울렁증은'),
    (r'정\s*확\s*히', '정확히'),
    (r'상\s*당\s*히', '상당히'),
    (r'극\s*복\s*할\s+수', '극복할 수'),
    (r'극\s*복\s*할\s*수', '극복할 수'),
    (r'대\s*부\s*분\s*의', '대부분의'),
    (r'전\s*문\s*적\s*인', '전문적인'),
    (r'성\s*경\s*신\s*학', '성경신학'),
    (r'이\s*해\s*할\s+수', '이해할 수'),
    (r'이\s*해\s*할\s*수', '이해할 수'),
    (r'극\s*복\s*한', '극복한'),
    (r'괭\s*장\s*히', '굉장히'),
    (r'많\s*은\s+혜\s*택', '많은 혜택'),
    (r'누\s*릴\s+수', '누릴 수'),
    (r'누\s*릴\s*수', '누릴 수'),
    (r'누\s*릴\s+수\s*가', '누릴 수가'),
    (r'누\s*릴\s*수\s*가', '누릴 수가'),
    (r'능\s*력\s*은', '능력은'),
    (r'해\s*결\s*되\s*지', '해결되지'),
    (r'단\s*순\s*히', '단순히'),
    (r'글\s*자\s*를', '글자를'),
    (r'올\s*라\s*가\s*면', '올라가면'),
    (r'변\s*화\s*가', '변화가'),
    (r'어\s*럽\s*다\s*고', '어렵다고'),
    (r'생\s*각\s*합\s*니\s*다', '생각합니다'),
    (r'단\s*수\s*에\s*서', '단수에서'),
    (r'복\s*수\s*로', '복수로'),
    (r'변\s*할\s+때', '변할 때'),
    (r'변\s*할\s*때', '변할 때'),
    (r'경\s*우\s*는', '경우는'),
    (r'명\s*사\s+뒤\s*에', '명사 뒤에'),
    (r'첨\s*가\s+해', '첨가해'),
    (r'해\s*주\s*면\s+됩\s*니\s*다', '해주면 됩니다'),
    (r'대\s*책\s+없\s*이', '대책 없이'),
    (r'대\s*책\s*없\s*이', '대책 없이'),
    (r'것\s+처\s*럼', '것처럼'),
    (r'보\s*입\s*니\s*다', '보입니다'),
    (r'설\s*명\s*해\s+주\s*는', '설명해 주는'),
    (r'책\s*은', '책은'),
    (r'생\s*각\s*하\s*시\s*는', '생각하시는'),
    (r'분\s*들\s*이', '분들이'),
    (r'많\s*습\s*니\s*다', '많습니다'),
    (r'단\s*순\s*한', '단순한'),
    (r'원\s*리\s*만', '원리만'),
    (r'원\s*리\s*만\s+알\s*면', '원리만 알면'),
    (r'해\s*결\s*됩\s*니\s*다', '해결됩니다'),
    (r'터\s*득\s*하\s*면', '터득하면'),
    (r'논\s*리\s*적\s*으\s*로', '논리적으로'),
    (r'설\s*명\s*됩\s*니\s*다', '설명됩니다'),
    (r'공\s*부\s*를', '공부를'),
    (r'관\s*통\s*하\s*는', '관통하는'),
    (r'변\s*화\s*무\s*쌍\s*해', '변화무쌍해'),
    (r'명\s*쾌\s+하\s*고', '명쾌하고'),
    (r'명\s*쾌\s*하\s*고', '명쾌하고'),
    (r'개\s*념\s*을', '개념을'),
    (r'잡\s*아\s*주\s*는', '잡아주는'),
    (r'부\s*담\s+갖\s*지', '부담 갖지'),
    (r'부\s*담\s*갖\s*지', '부담 갖지'),
    (r'지\s*식\s*이', '지식이'),
    (r'요\s*구\s*됩\s*니\s*다', '요구됩니다'),
    (r'닮\s*았\s*으\s*니', '닮았으니'),
    (r'힘\s*을', '힘을'),
    (r'들\s*이\s*지\s+않\s*고', '들이지 않고'),
    (r'들\s*이\s*지\s*않\s*고', '들이지 않고'),
    (r'곧\s+글\s*씨\s*를', '곧 글씨를'),
    (r'곧\s*글\s*씨\s*를', '곧 글씨를'),
    (r'있\s*게\s+됩\s*니\s*다', '있게 됩니다'),
    (r'있\s*게\s*됩\s*니\s*다', '있게 됩니다'),
    (r'수\s*업\s*에\s*서\s*는', '수업에서는'),
    (r'시\s*간\s*을', '시간을'),
    (r'할\s*애\s*하\s*지', '할애하지'),
    (r'않\s*습\s*니\s*다', '않습니다'),
    (r'한\s+번', '한 번'),
    (r'한\s*번', '한 번'),
    (r'설\s*명\s*을', '설명을'),
    (r'다음\s+시\s*간\s*까\s*지', '다음 시간까지'),
    (r'외\s*워\s+오\s*라\s*고', '외워 오라고'),
    (r'외\s*워\s*오\s*라\s*고', '외워 오라고'),
    (r'공\s*부\s*해\s*오\s*는', '공부해 오는'),
    (r'그\s*렇\s*게\s+많\s*지', '그렇게 많지'),
    (r'그\s*렇\s*게\s*많\s*지', '그렇게 많지'),
    (r'사\s*이\s*의', '사이의'),
    (r'악\s*연\s*은', '악연은'),
    (r'이\s*때\s*부\s*터', '이때부터'),
    (r'시\s*작\s*됩\s*니\s*다', '시작됩니다'),
    (r'제\s*대\s*로\s+알\s*지', '제대로 알지'),
    (r'제\s*대\s*로\s*알\s*지', '제대로 알지'),
    (r'다\s*음\s*의', '다음의'),
    (r'공\s*부\s*가', '공부가'),
    (r'어\s*떻\s*게\s+제\s*대\s*로', '어떻게 제대로'),
    (r'어\s*떻\s*게\s*제\s*대\s*로', '어떻게 제대로'),
    (r'잘\s*하\s*고\s+싶\s*다\s*면', '잘하고 싶다면'),
    (r'잘\s*하\s*고\s*싶\s*다\s*면', '잘하고 싶다면'),
    (r'드\s*리\s*고\s+싶\s*은', '드리고 싶은'),
    (r'드\s*리\s*고\s*싶\s*은', '드리고 싶은'),
    (r'부\s*탁\s*은', '부탁은'),
    (r'부\s*탁\s*을', '부탁을'),
    (r'한\s*글\s*처\s*럼', '한글처럼'),
    (r'완\s*전\s*히', '완전히'),
    (r'익\s*숙\s+해\s*질', '익숙해질'),
    (r'익\s*숙\s*해\s*질', '익숙해질'),
    (r'때\s*까\s*지\s+제\s*대\s*로', ' 때까지 제대로'),
    (r'때\s*까\s*지\s*제\s*대\s*로', '때까지 제대로'),
    (r'공\s*부\s*하\s*라\s*는', '공부하라는'),
    (r'구\s*성\s+하\s*고', '구성하고'),
    (r'구\s*성\s*하\s*고', '구성하고'),
    (r'특\s*성\s*을', '특성을'),
    (r'파\s*악\s+하\s*고', '파악하고'),
    (r'파\s*악\s*하\s*고', '파악하고'),
    (r'자\s*동\s+으\s*로', '자동으로'),
    (r'자\s*동\s*으\s*로', '자동으로'),
    (r'해\s*결\s+되\s*기', '해결되기'),
    (r'해\s*결\s*되\s*기', '해결되기'),
    (r'때\s*문\s*입\s*니\s*다', '때문입니다'),
    (r'자\s*신\s+있\s*게', '자신 있게'),
    (r'자\s*신\s*있\s*게', '자신 있게'),
    (r'뼈\s*대\s*를', '뼈대를'),
    (r'제\s*목\s*을', '제목을'),
    (r'달\s*수', '달 수'),
    (r'달\s*수\s*가', '달 수가'),
    (r'달수\s*가', '달 수가'),
    (r'바\s*로\s+이', '바로 이'),
    (r'바\s*로\s*이', '바로 이'),
    (r'척\s*추\s*를', '척추를'),
    (r'바\s*로\s+세\s*울', '바로 세울'),
    (r'바\s*로\s*세\s*울', '바로 세울'),
    (r'세\s*울\s+수\s*가', '세울 수가'),
    (r'세\s*울\s*수\s*가', '세울 수가'),
    (r'살\s*펴\s+보\s*도\s*록', '살펴보도록'),
    (r'살\s*펴\s*보\s*도\s*록', '살펴보도록'),
    (r'처\s*음\s+부\s*터', '처음부터'),
    (r'처\s*음\s*부\s*터', '처음부터'),
    (r'끝\s*까\s*지', '끝까지'),
    (r'모\s*두\s+다', '모두 다'),
    (r'모\s*두\s*다', '모두 다'),
    (r'존\s*재\s*하\s*지\s*가', '존재하지가'),
    (r'잘\s*못\s+알\s*고', '잘못 알고'),
    (r'잘\s*못\s*알\s*고', '잘못 알고'),
    (r'글\s*자\s*는', '글자는'),
    (r'다\s*음\s+과', '다음과'),
    (r'다\s*음\s*과', '다음과'),
    (r'같\s*이\s+생\s*겼\s*습\s*니\s*다', '같이 생겼습니다'),
    (r'같\s*이\s*생\s*겼\s*습\s*니\s*다', '같이 생겼습니다'),
    (r'첫\s+글\s*자\s*인', '첫 글자인'),
    (r'첫\s*글\s*자\s*인', '첫 글자인'),
    (r'영\s*어\s*의', '영어의'),
    (r'생\s*각\s+한\s*다\s*는', '생각한다는'),
    (r'생\s*각\s*한\s*다\s*는', '생각한다는'),
    (r'생\s*각\s+했\s*다\s*가\s*도', '생각했다가도'),
    (r'생\s*각\s*했\s*다\s*가\s*도', '생각했다가도'),
    (r'듣\s*는\s+즉\s*시', '듣는 즉시'),
    (r'듣\s*는\s*즉\s*시', '듣는 즉시'),
    (r'말\s+하\s*는', '말하는'),
    (r'말\s*하\s*는', '말하는'),
    (r'뜻\s*을', '뜻을'),
    (r'깨\s*닫\s*고', '깨닫고'),
    (r'말\s+에', '말에'),
    (r'말\s*에', '말에'),
    (r'동\s+의\s*하\s*게', '동의하게'),
    (r'동\s*의\s*하\s*게', '동의하게'),
    (r'일\s+수\s*가', '일 수가'),
    (r'일\s*수\s*가', '일 수가'),
    (r'전\s*부\s+다', '전부 다'),
    (r'전\s*부\s*다', '전부 다'),
    (r'자\s*음\s+인\s*데', '자음인데'),
    (r'자\s*음\s*인\s*데', '자음인데'),
    (r'반\s*해\s+영\s*어\s*의', '반해 영어의'),
    (r'반\s*해\s*영\s*어\s*의', '반해 영어의'),
    (r'모\s*음\s+이\s*기', '모음이기'),
    (r'모\s*음\s*이\s*기', '모음이기'),
    (r'일\s+리\s*가', '일 리가'),
    (r'일\s*리\s*가', '일 리가'),
    (r'외\s+에', '외에'),
    (r'외\s*에', '외에'),
    (r'따\s*로\s+존\s*재\s*합\s*니\s*다', '따로 존재합니다'),
    (r'따\s*로\s*존\s*재\s*합\s*니\s*다', '따로 존재합니다'),
    (r'해\s*당\s+하\s*고', '해당하고'),
    (r'해\s*당\s*하\s*고', '해당하고'),
    (r'해\s*당\s+하\s*는', '해당하는'),
    (r'해\s*당\s*하\s*는', '해당하는'),
    (r'마\s*찬\s*가\s*지\s+지\s*요', '마찬가지지요'),
    (r'마\s*찬\s*가\s*지\s*지\s*요', '마찬가지지요'),
    (r'결\s*합\s*을', '결합을'),
    (r'통\s+해', '통해'),
    (r'통\s*해', '통해'),
    (r'글\s*자\s*가', '글자가'),
    (r'만\s*들\s*어\s+지\s*는', '만들어지는'),
    (r'만\s*들\s*어\s*지\s*는', '만들어지는'),
    (r'경\s*우\s*에\s*도', '경우에도'),
    (r'역\s*시\s+마\s*찬\s*가\s*지', '역시 마찬가지'),
    (r'역\s*시\s*마\s*찬\s*가\s*지', '역시 마찬가지'),
    (r'자\s*음\s*이', '자음이'),
    (r'어\s*우\s+러\s*져\s*야', '어우러져야'),
    (r'어\s*우\s*러\s*져\s*야', '어우러져야'),
    (r'비\s*로\s+소', '비로소'),
    (r'비\s*로\s*소', '비로소'),
    (r'읽\s*을\s+수', '읽을 수'),
    (r'읽\s*을\s*수', '읽을 수'),
    (r'글\s*자\s*가', '글자가'),
    (r'선\s*명\s+하\s*게', '선명하게'),
    (r'선\s*명\s*하\s*게', '선명하게'),
    (r'이\s*해\s+하\s*셔\s*야', '이해하셔야'),
    (r'이\s*해\s*하\s*셔\s*야', '이해하셔야'),
    (r'공\s*부\s+하\s*기', '공부하기'),
    (r'공\s*부\s*하\s*기', '공부하기'),
    (r'위\s*해\s+서', '위해서'),
    (r'위\s*해\s*서', '위해서'),
    (r'반\s*드\s*시\s+깨\s*달\s*아\s*야', '반드시 깨달아야'),
    (r'반\s*드\s*시\s*깨\s*달\s*아\s*야', '반드시 깨달아야'),
    (r'특\s*성\s*은', '특성은'),
    (r'개\s*념\s*을', '개념을'),
    (r'주\s*제\s*를', '주제를'),
    (r'벗\s*어\s*나\s+기', '벗어나기'),
    (r'벗\s*어\s*나\s*기', '벗어나기'),
    (r'알\s*아\s+두\s*셔\s*야', '알아 두셔야'),
    (r'알\s*아\s*두\s*셔\s*야', '알아 두셔야'),
    (r'상\s*식\s*은', '상식은'),
    (r'구\s*성\s+요\s*소\s*는', '구성 요소는'),
    (r'구\s*성\s*요\s*소\s*는', '구성 요소는'),
    (r'위\s*치\s*에', '위치에'),
    (r'이\s*름\s*이', '이름이'),
    (r'설\s*명\s*을', '설명을'),
    (r'다\s*음\s+과', '다음과'),
    (r'다\s*음\s*과', '다음과'),
    (r'같\s*이\s+구\s*성', '같이 구성'),
    (r'같\s*이\s*구\s*성', '같이 구성'),
    (r'소\s*리\s+란', '소리란'),
    (r'소\s*리\s*란', '소리란'),
    (r'뜻\s*에\s*서', '뜻에서'),
    (r'초\s*성\s+이\s*라\s+고', '초성이라고'),
    (r'초\s*성\s*이\s*라\s*고', '초성이라고'),
    (r'부\s*릅\s+니\s*다', '부릅니다'),
    (r'부\s*릅\s*니\s*다', '부릅니다'),
    (r'초\s*성\s+이\s*지\s*요', '초성이지요'),
    (r'초\s*성\s*이\s*지\s*요', '초성이지요'),
    (r'중\s*성\s+이\s+라\s+고', '중성이라고'),
    (r'중\s*성\s*이\s*라\s*고', '중성이라고'),
    (r'종\s*성\s+이\s+라\s+고', '종성이라고'),
    (r'종\s*성\s*이\s*라\s*고', '종성이라고'),
    (r'종\s*성\s+이\s*지\s*요', '종성이지요'),
    (r'종\s*성\s*이\s*지\s*요', '종성이지요'),
    (r'경\s*우\s*는', '경우는'),
    (r'어\s*떻\s*습\s*니\s*까', '어떻습니까'),
    (r'상\s*식\s*적\s*으\s*로', '상식적으로'),
    (r'알\s*아\s+두\s*셔\s*야', '알아 두셔야'),
    (r'알\s*아\s*두\s*셔\s*야', '알아 두셔야'),
    (r'편\s*합\s*니\s*다', '편합니다'),
    (r'가\s*르\s+치\s*는', '가르치는'),
    (r'가\s*르\s*치\s*는', '가르치는'),
    (r'배\s*우\s*는', '배우는'),
    (r'외\s*국\s+어', '외국어'),
    (r'외\s*국\s*어', '외국어'),
    (r'개\s*념\s*을', '개념을'),
    (r'감\s*각\s*이', '감각이'),
    (r'역\s+으\s*로', '역으로'),
    (r'역\s*으\s*로', '역으로'),
    (r'결\s*합\s*의', '결합의'),
    (r'모\s*음\s*이', '모음이'),
    (r'마\s*구\s+변\s*하\s*기', '마구 변하기'),
    (r'마\s*구\s*변\s*하\s*기', '마구 변하기'),
    (r'변\s*화\s*의', '변화의'),
    (r'원\s*칙\s*을', '원칙을'),
    (r'느\s*껴\s*지\s*바\s*람', '느껴지바람'),
    (r'느\s*껴\s*지\s*는', '느껴지는'),
    (r'왕\s+이\s*란', '왕이란'),
    (r'왕\s*이\s*란', '왕이란'),
    (r'단\s*어\s*가', '단어가'),
    (r'아\s*시\s+지\s*요', '아시지요'),
    (r'아\s*시\s*지\s*요', '아시지요'),
    (r'알\s*고\s+나\s*면', '알고 나면'),
    (r'알\s*고\s*나\s*면', '알고 나면'),
    (r'S\s+를', 'S를'),
    (r'S\s*를', 'S를'),
    (r'붙\s*이\s*면\s+된\s*다\s*는', '붙이면 된다는'),
    (r'붙\s*이\s*면\s*된\s*다\s*는', '붙이면 된다는'),
    (r'제\s*외\s+하\s*고\s*는', '제외하고는'),
    (r'제\s*외\s*하\s*고\s*는', '제외하고는'),
    (r'불\s*변\s+이\s*야', '불변이야'),
    (r'불\s*변\s+입\s*니\s*다', '불변입니다'),
    (r'불\s*변\s*입\s*니\s*다', '불변입니다'),
    (r'소\s*리\s*가', '소리가'),
    (r'표\s*기\s+한', '표기한'),
    (r'표\s*기\s*한', '표기한'),
    (r'해\s*당\s+됩\s*니\s*다', '해당됩니다'),
    (r'해\s*당\s*됩\s*니\s*다', '해당됩니다'),
    (r'해\s*당\s+하\s*는', '해당하는'),
    (r'해\s*당\s*하\s*는', '해당하는'),
    (r'기\s*억\s+하\s*고', '기억하고'),
    (r'기\s*억\s*하\s*고', '기억하고'),
    (r'공\s*부\s+하\s*도\s*록', '공부하도록'),
    (r'공\s*부\s*하\s*도\s*록', '공부하도록'),

    # Systematic Korean Josa/Ending Spacing fixes (matching spacing errors from PDF extract)
    (r'([가-힣])\s+(라는|라는것|라는것은|를|을|에게|에게는|에서|에서의|에|으로|으로만|의|가|이|도|은|는|과|와|만|만으로|만으로도|처럼|보다|하고|이랑|랑|조차|마저|부터|까지|도|은|는)', r'\1\2'),
    (r'([가-힣])\s+(합니다|적입니다|들입니다|것입니다|합니다만|하겠습|하겠습니|습니|다|까|다만|다며|다고|지요|지요만|지요며|지요고|이다|이고|이며|이었다|였습니다|이다만)', r'\1\2'),
    (r'([가-힣])\s+(해야합니다|해야|할수|할수있|할수없|하셔야|하셔야만|하고|하지|하지않|않습니다|않은|않는|않을|않을것|않을것입|않을것입니다|않은것|않은것입|않은것입니다)', r'\1\2'),
    
    # Clean up spaces before punctuation
    (r'\s+\.', '.'),
    (r'\s+,', ','),
    (r'\s+\?', '?'),
    (r'\s+!', '!'),
]

def merge_broken_lines(text):
    lines = text.split('\n')
    merged_lines = []
    
    for i, line in enumerate(lines):
        line_str = line.strip()
        if not line_str:
            merged_lines.append("")
            continue
            
        is_special = (
            line_str.startswith('#') or 
            line_str.startswith('•') or 
            line_str.startswith('-') or 
            line_str.startswith('*') or 
            line_str.startswith('※') or
            re.match(r'^\d+\.', line_str) or  # 1. 2. 3.
            re.match(r'^\(\d+\)', line_str) or # (1) (2)
            re.match(r'^[①-⑩]', line_str) or  # ① ②
            re.match(r'^@[가-힣]', line_str) or # @경음점
            "*(이곳은" in line_str or
            "소릿값" in line_str or "한글표기" in line_str or
            "|" in line_str or
            (i > 0 and lines[i-1].strip().startswith('•'))
        )
        
        if is_special:
            merged_lines.append("\n" + line_str + "\n")
        else:
            if merged_lines and not merged_lines[-1].endswith('\n') and merged_lines[-1] != "":
                prev_line = merged_lines[-1]
                josa_pattern = r'^(이|가|을|를|은|는|에|의|로|으로|와|과|도|만|니다|합니다|했습니다|였다|이었다|이고|이며|했다|하는|은것|는것|이고|이다|라고|고|하며)'
                if re.match(r'[가-힣]$', prev_line) and re.match(josa_pattern, line_str):
                    merged_lines[-1] = prev_line + line_str
                else:
                    merged_lines[-1] = prev_line + " " + line_str
            else:
                merged_lines.append(line_str)
                
    result = "\n".join(merged_lines)
    result = re.sub(r'\n{3,}', '\n\n', result)
    result = re.sub(r' \n', '\n', result)
    result = re.sub(r'\n ', '\n', result)
    return result.strip()

# Apply corrections to each chapter
print("Applying cleaning dictionary and regex to chapters text...")
for ch_key, text in chapters_data.items():
    # 1. Apply large block replacements (for severely corrupted charts)
    for target, replacement in large_block_replacements:
        text = text.replace(target, replacement)

    # 2. Apply literal string replacements
    for target, replacement in replacements:
        text = text.replace(target, replacement)
        
    # 3. Clean footnotes and references (User request: 각주/도표 정보 등은 제거하고 부드럽게 이어지게)
    # Remove reference brackets like [Rev. Ed.; Oakland, Calif.: EKS Publishing, 2008], 3에 기초한 것임]
    text = re.sub(r'\[[^\]J]*(?:Rev|Ed|Publishing|EKS|Ed\.|2008|\d{4})[^\]J]*[\]J]', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\([^)]*(?:도표|Ethelyn|Simon|Joseph|Teach|Hebrew|Publishing)[^)]*\)', '', text, flags=re.IGNORECASE)
    
    # Remove specific footnote explanations
    text = re.sub(r'\(이하\s*의\s*도표는[^)]+\)', '', text)
    text = re.sub(r'\(이하\s*도표는[^)]+\)', '', text)
    text = re.sub(r'\(한국어에는\s*아직\s*정확히[^)]+\)', '', text)
    text = re.sub(r'\(실제로\s*발음할\s*때에는[^)]+\)', '', text)
    text = re.sub(r'\(원래는\s*히브리어의[^)]+\)', '', text)
    text = re.sub(r'\(음성학을\s*전공한[^)]+\)', '', text)
    text = re.sub(r'\(이에\s*반하여\s*영어는[^)]+\)', '', text)
    
    # Remove singleton page number lines (e.g. \n23\n, \n35\n)
    text = re.sub(r'\n+\d+\n+', '\n\n', text)
    
    # 4. Connect sentences that break across page headers
    text = re.sub(r'([가-힣])\s*\n*### Page \d+\n+\s*([가-힣])', r'\1 \2', text)
    
    # Remove remaining singleton Page headers to keep flow continuous
    text = re.sub(r'### Page \d+', '', text)

    # 5. Apply regex spacing patterns
    for pattern, replacement in spacing_patterns:
        text = re.sub(pattern, replacement, text)
        
    # 6. Clean up any remaining U+FFFD characters to prevent rendering glitches
    text = text.replace("\ufffd", "")
    
    # 7. Merge broken lines to keep continuous text flow
    text = merge_broken_lines(text)
    
    # 8. Clean up specific OCR orphan parenthesis typos
    text = text.replace("있기는합니다. )，", "있기는합니다.")
    text = text.replace("있기는합니다. )", "있기는합니다.")
    
    # 9. Final formatting: Clean double spaces and empty consecutive lines
    text = re.sub(r' +', ' ', text)
    text = re.sub(r' \n', '\n', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    chapters_data[ch_key] = text.strip()

# Write the cleaned data back to chapters_text.js
with open(filepath, "w", encoding="utf-8") as f:
    f.write("/**\n * Auto-generated chapter explanations extracted from PDF\n */\n\n")
    f.write("const CHAPTERS_TEXT = ")
    json.dump(chapters_data, f, ensure_ascii=False, indent=2)
    f.write(";\n\n")
    f.write("if (typeof module !== 'undefined' && module.exports) {\n")
    f.write("  module.exports = CHAPTERS_TEXT;\n")
    f.write("} else {\n")
    f.write("  window.CHAPTERS_TEXT = CHAPTERS_TEXT;\n")
    f.write("}\n")

print(f"Cleaning complete! Wrote cleaned text to {filepath}")
