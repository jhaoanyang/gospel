// 存三個福音書的 List
var listMat = [];
var listMak = [];
var listLuk = [];
var listMaked = false;

// 按下標題時
$( "h2" ).click( function() {

    // List 只有第一次點擊才做
    if( listMaked === false ) {
        makeLists();
        listMaked = true;
    }

    if ( this.classList[ 1 ] != "sorted" ) {
        
        // 清除所有人的箭頭、sorted、還原列表
        for( var i = 0; i < $( "h2" ).length; i++ ) {
            var head = $( "h2" )[ i ];
            head.innerText = head.innerText.substr( 0, 4 );
            $ ( head ).removeClass( "sorted ");
        }
        reduction();

        // 標記 sorted、加箭頭、依照它排序
        $( this ).addClass( "sorted" );
        this.innerText = this.innerText + "▼";
        sortInContrastOrder ( this.classList[ 0 ] );


    } else {
        
        // 如果 sorted 被點，純粹還原
        $( this ).removeClass( "sorted" )
        this.innerText = this.innerText.substr( 0, 4 );
        reduction();

    }

});
    

    // 主要功能
// 把網頁以 ### 福音書為主，對照排序
function sortInContrastOrder( mainGospel ) {

    // 主福音書：mainGospel
    // 副福音書：otherGospel
    otherGospel = [ "Mat", "Mak", "Luk" ];
    otherGospel.splice( otherGospel.indexOf( mainGospel ), 1 );
    

    var counter = 0;
    temList = [];
    paraCounter = 0;
    paraList = [];


    // 當主福音書還沒讀完
    var gospelLength = list( mainGospel ).length;
    while ( counter < gospelLength ){

        // 輸出連續沒有對照的節，放到 Para-偶數 的 div .col
        counter = strikingNormal ( mainGospel, temList, counter, gospelLength );
        outputMain( mainGospel, temList, paraCounter );
        paraCounter++;
        temList = [];
        

        // 輸出連續同一對照的節，放到 Para-奇數 的 div .col
        counter = strkingContrast( mainGospel, temList, counter, gospelLength, paraList );
        outputMain( mainGospel, temList, paraCounter );
        // Contrast 加上底色
        $("<style>")
        .prop( "type", "text/css" )
        .prop( "class", "Para")
        .html( ".Para-" + paraCounter + "{ background-color: #f5fcc1; }" )
        .appendTo( "head" );
        paraCounter++;

        temList = [];
    }
        // 輸出空白 Para-偶數 的 div .col
        outputMain( mainGospel, "", paraCounter);


    // 副福音書輸出
    semiGospel (paraList, 0);
    semiGospel (paraList, 1);

}



    // 主功能用到的函數
// 把福音書放入固定的 array
function makeLists() {
    for ( var i = 0; i < $( ".Mat" ).length; i++ ) {
        listMat.push( $( ".Mat" )[ i ] );
    }
    
    for ( var i = 0; i < $( ".Mak" ).length; i++ ) {
        listMak.push( $( ".Mak" )[ i ] );
    }
    
    for ( var i = 0; i < $( ".Luk" ).length; i++ ) {
        listLuk.push( $( ".Luk" )[ i ] );
    }
    listMaked = true;    
}

// 字串轉變數
function list( string ) {
    switch (string) {
        case "Mat":
            return listMat;
        case "Mak":
            return listMak;
        case "Luk":
            return listLuk;
        default:
            break;
    }
}

// 還原
function reduction() {

    for ( i = 0; i < list( "Mat" ).length; i++ ) {
        $( ".Mat-memo" ).append( list( "Mat" )[i] );
        $( list( "Mat" )[i] ).removeClass( "moved" );
    }
    for ( i = 0; i < list( "Mak" ).length; i++ ) {
        $( ".Mak-memo" ).append( list( "Mak" )[i] );
        $( list( "Mak" )[i] ).removeClass( "moved" );
    }
    for ( i = 0; i < list( "Luk" ).length; i++ ) {
        $( ".Luk-memo" ).append( list( "Luk" )[i] );
        $( list( "Luk" )[i] ).removeClass( "moved" );
    }
    $( ".Para" ).remove();

}


// 抓出 ### 福音連續非 Contrast 的段落
function strikingNormal ( whichGospel, whichList, whichCounter, length) {

    var whichVerse;
    for ( whichCounter; whichCounter < length ; whichCounter++ ) {
        whichVerse = list( whichGospel )[ whichCounter ];
        if ( whichVerse.classList[ 2 ] === undefined ) {
            whichList.push( list( whichGospel )[ whichCounter ] );
        } else {
            break;
        }
    }
    return whichCounter;
}

// 抓出 ### 福音連續 Contrast 的段落
function strkingContrast ( whichGospel, whichList, whichCounter, length, paraList) {
    
    var whichVerse  = list( whichGospel )[ whichCounter ];
    whichContrast = whichVerse.classList[ 2 ];
    for ( whichCounter; whichCounter < length ; whichCounter++ ) {
        whichVerse = list( whichGospel )[ whichCounter ]
        if ( whichVerse.classList[ 2 ] === whichContrast ) {
            whichList.push( list( whichGospel )[ whichCounter ] );
        } else {
            paraList.push ( list( whichGospel )[ whichCounter - 1 ] );
            break;
        }   
    }
    return whichCounter;
}

// 做出動態等高 div 再輸出
function outputMain ( g0, g_0, paraCounter ) {

    // 動態等高表格
    $( ".container-fluid" ).append( '<div class="row Para Para-' + paraCounter + '"></div>' );
    $( ".row.Para-" + paraCounter ).append( '<div class="Para col-md-4 col-6"><ul class="Mat Para Para-' + paraCounter + '"></ul></div>' );
    $( ".row.Para-" + paraCounter ).append( '<div class="Para col-md-4 col-6"><ul class="Mak Para Para-' + paraCounter + '"></ul></div>' );
    $( ".row.Para-" + paraCounter ).append( '<div class="Para col-md-4 col-6"><ul class="Luk Para Para-' + paraCounter + '"></ul></div>' );

    // 福音書輸出對應的 List
    $( "." + g0 + ".Para-" + paraCounter ).append( g_0 );
    
};

// 副福音書輸出
function semiGospel ( paraList, k) {
    var whichGospel,
    paraListVerse,
    otherGospelVerse,
    pasted;
    semiParaList = [];
    

    // 把副福音書的 Contrast 章節放入對應的 div .col
    whichGospel = otherGospel[ k ];


    // 找遍 paraList
    for ( var i = 0; i < paraList.length; i++ ) {
        paraListVerse = paraList[ i ];
        pasted = false;

        // 找遍副福音書
        for ( var j = 0; j < list( whichGospel ).length; j++ ) {
            otherGospelVerse = list( whichGospel )[ j ];

            // 如果 Contrast-### 相同就放入同一個 div .row
            if ( otherGospelVerse.classList[ 2 ] === paraListVerse.classList[ 2 ] ) {
                $( "." + whichGospel + ".Para-" + ( i * 2 + 1 ) ).append( otherGospelVerse );
                $ ( otherGospelVerse ).addClass( "moved" );
                pasted = true;
            } else if( pasted === true ) {

                // 把每一個 Contrast-### 的最後一個元素的 Para-###、及其本身 放入 semiParaList 
                semiParaList.push ( ".Para-" + ( i * 2 + 2 ) );
                semiParaList.push ( list( whichGospel )[ j - 1 ] );
                break;
            }        
        }  
    }


    var semiParaListVerseNumber,
    verseNumber;
    j = list( whichGospel ).length - 1;

    // 反著找遍 semiParaList
    for( var i = ( semiParaList.length - 1) ; i >= 0; i = i - 2 ) {

        semiParaListVerse = semiParaList[ i ];
        // 找到 paraList[ i ] 的章節數字，定為目前標記
        semiParaListVerseNumber = parseInt( semiParaListVerse.classList[ 1 ].substr( 4, 2 ) + semiParaListVerse.classList[ 1 ].substr( 7, 2 ) );
        
        
        // 副福音書的章節、章節數字
        otherGospelVerse = list( whichGospel )[ j ];
        verseNumber = parseInt( otherGospelVerse.classList[ 1 ].substr( 4, 2 ) + otherGospelVerse.classList[ 1 ].substr( 7, 2 ) );
 
        // 反著找遍副福音書，直到章節小於等於標記
        while( semiParaListVerseNumber < verseNumber  ) {
            otherGospelVerse = list( whichGospel )[ j ];
            verseNumber = parseInt( otherGospelVerse.classList[ 1 ].substr( 4, 2 ) + otherGospelVerse.classList[ 1 ].substr( 7, 2 ) );

                // 已經章節比標記大、且沒有被搬移過的輸出
                if( !( $( otherGospelVerse ).hasClass( "moved" ) ) ) {
                    $( "." + whichGospel + semiParaList[ i - 1 ] ).prepend( otherGospelVerse );
                }
            j --;
        }

    }

    while( j >= 0 ) {
        otherGospelVerse = list( whichGospel )[ j ];
        if( !( $( otherGospelVerse ).hasClass( "moved" ) ) ) {
            $( "." + whichGospel + ".Para-0" ).prepend( otherGospelVerse );
        }
        j--;
    }

}