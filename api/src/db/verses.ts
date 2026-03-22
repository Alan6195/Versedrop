// Built-in Bible verse database for search (no API key needed)
export interface VerseEntry {
  reference: string;
  text: string;
  book: string;
}

export const BIBLE_VERSES: VerseEntry[] = [
  // Genesis
  { reference: 'Genesis 1:1', text: 'In the beginning God created the heaven and the earth.', book: 'Genesis' },
  { reference: 'Genesis 1:27', text: 'So God created man in his own image, in the image of God created he him; male and female created he them.', book: 'Genesis' },
  { reference: 'Genesis 9:13', text: 'I do set my bow in the cloud, and it shall be for a token of a covenant between me and the earth.', book: 'Genesis' },

  // Exodus
  { reference: 'Exodus 14:14', text: 'The LORD shall fight for you, and ye shall hold your peace.', book: 'Exodus' },
  { reference: 'Exodus 15:2', text: 'The LORD is my strength and song, and he is become my salvation.', book: 'Exodus' },

  // Deuteronomy
  { reference: 'Deuteronomy 31:6', text: 'Be strong and of a good courage, fear not, nor be afraid of them: for the LORD thy God, he it is that doth go with thee; he will not fail thee, nor forsake thee.', book: 'Deuteronomy' },
  { reference: 'Deuteronomy 31:8', text: 'And the LORD, he it is that doth go before thee; he will be with thee, he will not fail thee, neither forsake thee: fear not, neither be dismayed.', book: 'Deuteronomy' },

  // Joshua
  { reference: 'Joshua 1:9', text: 'Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.', book: 'Joshua' },

  // Psalms
  { reference: 'Psalm 23:1', text: 'The LORD is my shepherd; I shall not want.', book: 'Psalms' },
  { reference: 'Psalm 23:4', text: 'Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.', book: 'Psalms' },
  { reference: 'Psalm 27:1', text: 'The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?', book: 'Psalms' },
  { reference: 'Psalm 34:8', text: 'O taste and see that the LORD is good: blessed is the man that trusteth in him.', book: 'Psalms' },
  { reference: 'Psalm 37:4', text: 'Delight thyself also in the LORD; and he shall give thee the desires of thine heart.', book: 'Psalms' },
  { reference: 'Psalm 46:1', text: 'God is our refuge and strength, a very present help in trouble.', book: 'Psalms' },
  { reference: 'Psalm 46:10', text: 'Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth.', book: 'Psalms' },
  { reference: 'Psalm 51:10', text: 'Create in me a clean heart, O God; and renew a right spirit within me.', book: 'Psalms' },
  { reference: 'Psalm 91:1', text: 'He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.', book: 'Psalms' },
  { reference: 'Psalm 91:11', text: 'For he shall give his angels charge over thee, to keep thee in all thy ways.', book: 'Psalms' },
  { reference: 'Psalm 119:105', text: 'Thy word is a lamp unto my feet, and a light unto my path.', book: 'Psalms' },
  { reference: 'Psalm 121:1-2', text: 'I will lift up mine eyes unto the hills, from whence cometh my help. My help cometh from the LORD, which made heaven and earth.', book: 'Psalms' },
  { reference: 'Psalm 139:14', text: 'I will praise thee; for I am fearfully and wonderfully made: marvellous are thy works; and that my soul knoweth right well.', book: 'Psalms' },
  { reference: 'Psalm 150:6', text: 'Let every thing that hath breath praise the LORD. Praise ye the LORD.', book: 'Psalms' },

  // Proverbs
  { reference: 'Proverbs 3:5-6', text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.', book: 'Proverbs' },
  { reference: 'Proverbs 4:23', text: 'Keep thy heart with all diligence; for out of it are the issues of life.', book: 'Proverbs' },
  { reference: 'Proverbs 16:3', text: 'Commit thy works unto the LORD, and thy thoughts shall be established.', book: 'Proverbs' },
  { reference: 'Proverbs 22:6', text: 'Train up a child in the way he should go: and when he is old, he will not depart from it.', book: 'Proverbs' },
  { reference: 'Proverbs 27:17', text: 'Iron sharpeneth iron; so a man sharpeneth the countenance of his friend.', book: 'Proverbs' },

  // Ecclesiastes
  { reference: 'Ecclesiastes 3:1', text: 'To every thing there is a season, and a time to every purpose under the heaven.', book: 'Ecclesiastes' },

  // Isaiah
  { reference: 'Isaiah 40:31', text: 'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.', book: 'Isaiah' },
  { reference: 'Isaiah 41:10', text: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.', book: 'Isaiah' },
  { reference: 'Isaiah 43:2', text: 'When thou passest through the waters, I will be with thee; and through the rivers, they shall not overflow thee.', book: 'Isaiah' },
  { reference: 'Isaiah 53:5', text: 'But he was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed.', book: 'Isaiah' },
  { reference: 'Isaiah 54:17', text: 'No weapon that is formed against thee shall prosper; and every tongue that shall rise against thee in judgment thou shalt condemn.', book: 'Isaiah' },

  // Jeremiah
  { reference: 'Jeremiah 29:11', text: 'For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.', book: 'Jeremiah' },
  { reference: 'Jeremiah 33:3', text: 'Call unto me, and I will answer thee, and shew thee great and mighty things, which thou knowest not.', book: 'Jeremiah' },

  // Lamentations
  { reference: 'Lamentations 3:22-23', text: 'It is of the LORD\'s mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.', book: 'Lamentations' },

  // Matthew
  { reference: 'Matthew 5:14', text: 'Ye are the light of the world. A city that is set on an hill cannot be hid.', book: 'Matthew' },
  { reference: 'Matthew 6:33', text: 'But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.', book: 'Matthew' },
  { reference: 'Matthew 7:7', text: 'Ask, and it shall be given you; seek, and ye shall find; knock, and it shall be opened unto you.', book: 'Matthew' },
  { reference: 'Matthew 11:28', text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.', book: 'Matthew' },
  { reference: 'Matthew 19:26', text: 'But Jesus beheld them, and said unto them, With men this is impossible; but with God all things are possible.', book: 'Matthew' },
  { reference: 'Matthew 28:20', text: 'Teaching them to observe all things whatsoever I have commanded you: and, lo, I am with you alway, even unto the end of the world. Amen.', book: 'Matthew' },

  // Mark
  { reference: 'Mark 11:24', text: 'Therefore I say unto you, What things soever ye desire, when ye pray, believe that ye receive them, and ye shall have them.', book: 'Mark' },

  // Luke
  { reference: 'Luke 1:37', text: 'For with God nothing shall be impossible.', book: 'Luke' },

  // John
  { reference: 'John 1:1', text: 'In the beginning was the Word, and the Word was with God, and the Word was God.', book: 'John' },
  { reference: 'John 3:16', text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.', book: 'John' },
  { reference: 'John 8:32', text: 'And ye shall know the truth, and the truth shall make you free.', book: 'John' },
  { reference: 'John 10:10', text: 'The thief cometh not, but for to steal, and to kill, and to destroy: I am come that they might have life, and that they might have it more abundantly.', book: 'John' },
  { reference: 'John 13:34', text: 'A new commandment I give unto you, That ye love one another; as I have loved you, that ye also love one another.', book: 'John' },
  { reference: 'John 14:6', text: 'Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.', book: 'John' },
  { reference: 'John 14:27', text: 'Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.', book: 'John' },
  { reference: 'John 16:33', text: 'These things I have spoken unto you, that in me ye might have peace. In the world ye shall have tribulation: but be of good cheer; I have overcome the world.', book: 'John' },

  // Romans
  { reference: 'Romans 5:8', text: 'But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us.', book: 'Romans' },
  { reference: 'Romans 8:1', text: 'There is therefore now no condemnation to them which are in Christ Jesus, who walk not after the flesh, but after the Spirit.', book: 'Romans' },
  { reference: 'Romans 8:28', text: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.', book: 'Romans' },
  { reference: 'Romans 8:31', text: 'What shall we then say to these things? If God be for us, who can be against us?', book: 'Romans' },
  { reference: 'Romans 8:38-39', text: 'For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come, nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.', book: 'Romans' },
  { reference: 'Romans 10:9', text: 'That if thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart that God hath raised him from the dead, thou shalt be saved.', book: 'Romans' },
  { reference: 'Romans 12:2', text: 'And be not conformed to this world: but be ye transformed by the renewing of your mind, that ye may prove what is that good, and acceptable, and perfect, will of God.', book: 'Romans' },

  // 1 Corinthians
  { reference: '1 Corinthians 10:13', text: 'There hath no temptation taken you but such as is common to man: but God is faithful, who will not suffer you to be tempted above that ye are able.', book: '1 Corinthians' },
  { reference: '1 Corinthians 13:4-5', text: 'Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up, doth not behave itself unseemly, seeketh not her own, is not easily provoked, thinketh no evil.', book: '1 Corinthians' },
  { reference: '1 Corinthians 16:13', text: 'Watch ye, stand fast in the faith, quit you like men, be strong.', book: '1 Corinthians' },

  // 2 Corinthians
  { reference: '2 Corinthians 5:7', text: 'For we walk by faith, not by sight.', book: '2 Corinthians' },
  { reference: '2 Corinthians 5:17', text: 'Therefore if any man be in Christ, he is a new creature: old things are passed away; behold, all things are become new.', book: '2 Corinthians' },
  { reference: '2 Corinthians 12:9', text: 'And he said unto me, My grace is sufficient for thee: for my strength is made perfect in weakness.', book: '2 Corinthians' },

  // Galatians
  { reference: 'Galatians 2:20', text: 'I am crucified with Christ: nevertheless I live; yet not I, but Christ liveth in me: and the life which I now live in the flesh I live by the faith of the Son of God, who loved me, and gave himself for me.', book: 'Galatians' },
  { reference: 'Galatians 5:22-23', text: 'But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith, meekness, temperance: against such there is no law.', book: 'Galatians' },

  // Ephesians
  { reference: 'Ephesians 2:8-9', text: 'For by grace are ye saved through faith; and that not of yourselves: it is the gift of God: Not of works, lest any man should boast.', book: 'Ephesians' },
  { reference: 'Ephesians 3:20', text: 'Now unto him that is able to do exceeding abundantly above all that we ask or think, according to the power that worketh in us.', book: 'Ephesians' },
  { reference: 'Ephesians 6:10', text: 'Finally, my brethren, be strong in the Lord, and in the power of his might.', book: 'Ephesians' },

  // Philippians
  { reference: 'Philippians 1:6', text: 'Being confident of this very thing, that he which hath begun a good work in you will perform it until the day of Jesus Christ.', book: 'Philippians' },
  { reference: 'Philippians 4:6-7', text: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.', book: 'Philippians' },
  { reference: 'Philippians 4:13', text: 'I can do all things through Christ which strengtheneth me.', book: 'Philippians' },
  { reference: 'Philippians 4:19', text: 'But my God shall supply all your need according to his riches in glory by Christ Jesus.', book: 'Philippians' },

  // Colossians
  { reference: 'Colossians 3:23', text: 'And whatsoever ye do, do it heartily, as to the Lord, and not unto men.', book: 'Colossians' },

  // 2 Timothy
  { reference: '2 Timothy 1:7', text: 'For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.', book: '2 Timothy' },

  // Hebrews
  { reference: 'Hebrews 11:1', text: 'Now faith is the substance of things hoped for, the evidence of things not seen.', book: 'Hebrews' },
  { reference: 'Hebrews 12:1', text: 'Wherefore seeing we also are compassed about with so great a cloud of witnesses, let us lay aside every weight, and the sin which doth so easily beset us, and let us run with patience the race that is set before us.', book: 'Hebrews' },
  { reference: 'Hebrews 13:5', text: 'Let your conversation be without covetousness; and be content with such things as ye have: for he hath said, I will never leave thee, nor forsake thee.', book: 'Hebrews' },

  // James
  { reference: 'James 1:2-3', text: 'My brethren, count it all joy when ye fall into divers temptations; Knowing this, that the trying of your faith worketh patience.', book: 'James' },
  { reference: 'James 1:5', text: 'If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him.', book: 'James' },
  { reference: 'James 4:8', text: 'Draw nigh to God, and he will draw nigh to you.', book: 'James' },

  // 1 Peter
  { reference: '1 Peter 5:7', text: 'Casting all your care upon him; for he careth for you.', book: '1 Peter' },

  // 1 John
  { reference: '1 John 1:9', text: 'If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness.', book: '1 John' },
  { reference: '1 John 4:4', text: 'Ye are of God, little children, and have overcome them: because greater is he that is in you, than he that is in the world.', book: '1 John' },
  { reference: '1 John 4:19', text: 'We love him, because he first loved us.', book: '1 John' },

  // Revelation
  { reference: 'Revelation 3:20', text: 'Behold, I stand at the door, and knock: if any man hear my voice, and open the door, I will come in to him, and will sup with him, and he with me.', book: 'Revelation' },
  { reference: 'Revelation 21:4', text: 'And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away.', book: 'Revelation' },
];

export function searchVerses(query: string): VerseEntry[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const terms = q.split(/\s+/).filter(Boolean);

  return BIBLE_VERSES
    .map((v) => {
      const searchable = `${v.reference} ${v.text} ${v.book}`.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (searchable.includes(term)) score++;
      }
      return { ...v, score };
    })
    .filter((v) => v.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);
}
