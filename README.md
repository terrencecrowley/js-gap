# js-gap
This is a Typescript implementation of a gapped buffer.

A gapped buffer is an extensible array (like a normal Javascript Array) except that inserts
and deletes behave with amoritized constant time rather than linear. This means that walks
over an array doing O(N) inserts and deletes run in linear time rather than O(N^2).

A typical extensible array maintains empty space only at the end which means that inserts
or deletes anywhere else require shifting O(N) elements. A gapped buffer maintains the empty
space near where the last insert or delete occurred. Therefore inserts or deletes with
locality are very cheap.

Reading or writing existing values do not require moving the gap and have performance equivalent
to a standard Array.

A gapped buffer's performance can degrade if the gap "thrashes" - that is if inserts and deletes
exhibit no locality. Of course, this is no worse than a standard Array but might be worse than
more complex linked data structures.
